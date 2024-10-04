import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

function LineChart() {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "Novermber",
    "December",
  ];

  return (
    <Line
      options={{
        responsive: true,
        plugins: {},
        interaction: {
          intersect: false,
          mode: "index",
        },
        scales: {
          x: {
            grid: { tickWidth: 0, tickLength: 10 },
            ticks: {
              maxRotation: 0,
              textStrokeWidth: 1,
              maxTicksLimit: 10,
            },
          },
          y: {
            grid: {
              tickLength: 15,
              display: false,
            },
          },
        },
      }}
      data={{
        labels,
        datasets: [
          {
            label: "Dataset 1",
            data: [5, 2, 12, 23, 52, 23, 1, 34, 3, 23, 12, 13],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            tension: 0.4,
            pointRadius: 0,
          },
          {
            label: "Dataset 2",
            data: [12, 23, 52, 1, 23, 34, 23, 12, 13],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      }}
    />
  );
}

export default LineChart;
