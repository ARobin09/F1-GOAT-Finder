# F1 GOAT Finder
Aidan Robin, Utsav Gowda
## Inspiration
Watching yesterday's 2025 Azerbaijan Qualifying while we were waiting for the SteelHacks opening ceremony.

## What it does
Rates drivers you select based on the positions they finish at in the circuit. This metric is then converted to a scale of 0-100 and ranks them from best to worst.

## How we built it
_1. Core Architecture_
**Stack:**
For the main build, we used a single-page app built on React foundation using Typescript. Typescript was helpful in maintaining code quality, as well as debugging. 

**Components:**
The UI was structured using component based architecture. We created reusable, modular components like a generic Selector for dropdowns and a AnalysisRanker component. 

**Styling:**
For styling, we used Tailwind CSS. This approach helped us build a visually appealing dark theme design without having to write a lot of custom CSS. 

_2. State Management & Data Flow_

**React Hooks:**
The state management is handled within the main App component using React Hooks. We used useState to manage user selections, useEffect to trigger data fetching based on changes in user input, and useMemo to optimize expensive calculations, like filtering the driver list.

**Asynchronous Operations**
The application communicates with the backend which utilizes MongoDB that stores CSV files with the matching race data. This race data is then converted to a 0-100 scale, which then ranks the drivers based on a performance score.


## Challenges we ran into
We initially struggled a bit with the front end, and trying to get the page to actually show up on our browser. We then struggled getting the backend to actually fetch the data from our chosen API; we simply did not have enough time to troubleshoot why the API couldn't be accessed. We ended up using MongoDB to store CSV files that contained the necessary race data to perform the analysis.

## Accomplishments that we're proud of
Developed a live, full-stack website.
Pulled an all nighter, finished in the nick of time.

## What we learned
A LOT - HTML, CSS, TypeScript, Database Management, Querying, Frontend-Backend Integration, and how to ruin your sleep schedule

## What's next for Formula 1 GOAT Analyzer
We want to expand the selection of drivers. We also want to judge using more metrics like weather, regulation set, and other data points.
