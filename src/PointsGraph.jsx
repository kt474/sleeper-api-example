import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const PointsGraph = ({ leagueId }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch league users and rosters
        const [usersResponse, rostersResponse] = await Promise.all([
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`).then(
            (res) => res.json()
          ),
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`).then(
            (res) => res.json()
          ),
        ]);

        // Create user map for easy lookup
        const userMap = {};
        usersResponse.forEach((user) => {
          userMap[user.user_id] = user.display_name;
        });
        console.log(userMap);

        // Process roster data
        const teamData = rostersResponse.map((roster) => {
          const teamName = userMap[roster.owner_id];
          const points =
            roster.settings.fpts + roster.settings.fpts_decimal / 100;

          return {
            teamName,
            points,
          };
        });

        // Sort by points (highest first)
        teamData.sort((a, b) => b.points - a.points);

        // Prepare data for ApexCharts
        setChartData({
          teams: teamData.map((team) => team.teamName),
          points: teamData.map((team) => parseFloat(team.points.toFixed(2))),
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load league data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [leagueId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!chartData) return <div>No data available</div>;

  // Chart configuration
  const chartOptions = {
    chart: {
      type: "bar",
      height: 500,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          position: "bottom",
        },
      },
    },
    series: [
      {
        name: "Total Points",
        data: chartData.points,
      },
    ],
    xaxis: {
      categories: chartData.teams,
    },
    title: {
      text: "Total Fantasy Points by Team",
      align: "center",
    },
  };

  return (
    <div>
      <Chart
        options={chartOptions}
        series={chartOptions.series}
        type="bar"
        height={500}
      />
    </div>
  );
};

export default PointsGraph;
