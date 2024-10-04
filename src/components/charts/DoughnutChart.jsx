import { Chart as ChartJS, ArcElement, Tooltip, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Title);

export const data = {
  labels: ["Yellow", "Blue"],
  datasets: [
    {
      label: "Count",
      data: [12, 19],
      backgroundColor: ["#FEC751", "#51BBF0"],
      borderColor: ["#FEC751", "#51BBF0"],
      borderWidth: 1,
    },
  ],
};

function DoughnutChart() {
  return <Doughnut data={data} />;
}

export default DoughnutChart;
