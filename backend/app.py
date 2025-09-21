# backend/app.py

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from collections import defaultdict

# Load environment variables from a .env file in the 'backend' directory
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "https://arobin09.github.io"]}})

# --- Database Connection ---
MONGO_URI = os.getenv('MONGO_URI')
if MONGO_URI:
    client = MongoClient(MONGO_URI)
    db = client['f1DB']
    results_collection = db['results']
    races_collection = db['races']
else:
    print("Warning: MONGO_URI not found. /api/analyze endpoint will fail.")

# --- Hardcoded Dictionaries for Initial Data ---
DRIVER_ID_MAP = {
    "Lewis Hamilton": 1,
    "Max Verstappen": 830,
    "Fernando Alonso": 4,
    "Charles Leclerc": 844,
    "Lando Norris": 846,
}

CIRCUIT_ID_MAP = {
    "Monaco, Monte Carlo": 6,
    "Silverstone, UK": 9,
    "Spa-Francorchamps, Belgium": 13,
    "Monza, Italy": 14,
    "Suzuka, Japan": 22,
    "Interlagos, Brazil": 18,
}


@app.route('/api/initial-data', methods=['GET'])
def get_initial_data():
    return jsonify({
        'drivers': DRIVER_ID_MAP,
        'circuits': CIRCUIT_ID_MAP
    })


@app.route('/api/analyze', methods=['POST'])
def analyze_drivers():
    try:
        if not MONGO_URI:
            raise ConnectionError("MongoDB connection not configured.")

        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request body."}), 400

        selected_drivers = data.get('drivers', [])
        selected_circuit_id = data.get('circuitId')

        if not selected_drivers or selected_circuit_id is None:
            return jsonify({"error": "Missing 'drivers' or 'circuitId'."}), 400

        # Convert driver IDs to integers
        driver_ids = [int(driver['id']) for driver in selected_drivers]
        driver_lookup = {int(driver['id']): driver for driver in selected_drivers}

        # --- MongoDB Aggregation Pipeline ---
        pipeline = [
            {
                "$lookup": {
                    "from": "races",
                    "localField": "raceId",
                    "foreignField": "raceId",
                    "as": "raceInfo"
                }
            },
            {"$unwind": "$raceInfo"},
            {
                "$match": {
                    "driverId": {"$in": driver_ids},
                    "raceInfo.circuitId": selected_circuit_id
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "driverId": 1,
                    "position": 1
                }
            }
        ]

        results = list(results_collection.aggregate(pipeline))
        if not results:
            return jsonify([])

        # --- Group results by driverId ---
        positions_by_driver = defaultdict(list)
        for result in results:
            driver_id = result['driverId']
            pos = result['position']
            positions_by_driver[driver_id].append(pos)

        # --- Scoring Function (0–100 based on position) ---
        def calculate_score(positions):
            numeric_positions = []
            dnf_count = 0

            for pos in positions:
                if pos == "\\N":
                    dnf_count += 1
                else:
                    try:
                        numeric_positions.append(int(pos))
                    except ValueError:
                        dnf_count += 1

            if not numeric_positions and dnf_count == 0:
                return 0

            avg_position = sum(numeric_positions) / len(numeric_positions) if numeric_positions else 20

            # Custom scoring formula
            score = 100 - (avg_position * 5) - (dnf_count * 5)
            return max(0, min(100, round(score, 2)))

        # --- Score each driver ---
        scored_results = []
        for driver_id, positions in positions_by_driver.items():
            driver_info = driver_lookup.get(driver_id)
            if not driver_info:
                continue

            score = calculate_score(positions)
            scored_results.append({
                "driver": driver_info,
                "score": score
            })

        # --- Rank the results ---
        ranked = sorted(scored_results, key=lambda x: x['score'], reverse=True)
        final_results_with_rank = [{**result, "rank": i + 1} for i, result in enumerate(ranked)]

        return jsonify(final_results_with_rank)

    except ConnectionError as ce:
        print(f"Connection Error during analysis: {ce}")
        return jsonify({"error": "Database connection is not configured on the server."}), 500
    except Exception as e:
        print(f"Error during analysis: {e}")
        return jsonify({"error": "An unexpected error occurred during analysis."}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
