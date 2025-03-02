import PointsGraph from "./PointsGraph";
import "./App.css";

function App() {
  // Replace with your actual league ID
  const LEAGUE_ID = "1131659515188871168";

  return (
    <div className="app">
      <header>
        <h1>Fantasy Football Points Visualization</h1>
      </header>
      <main>
        <PointsGraph leagueId={LEAGUE_ID} />
      </main>
    </div>
  );
}

export default App;
