import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from "chart.js";
import "chartjs-adapter-moment";
import { format, startOfWeek } from "date-fns";
import { hsl2Rgba } from "../services/Helper";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler);

const transformData = (expenses) => {
  const categories = [...new Set(expenses.map((expense) => expense.category))];
  const dates = [...new Set(expenses.map((expense) => expense.date))].sort();

  const datasets = categories.map((category) => {
    const dataForCategory = new Array(dates.length).fill(0);
    expenses.forEach((expense) => {
      if (expense.category === category) {
        const index = dates.indexOf(expense.date);
        dataForCategory[index] += expense.amount;
      }
    });
    return {
      label: category,
      data: dataForCategory,
      // Customize each category line here (colors, etc.)
    };
  });

  return {
    labels: dates,
    datasets: datasets,
  };
};

const ExpensesChart = ({ expenses, categories }) => {
  const aggregateExpenses = (expensesData) => {
    const expensesByDateAndCategory = {};

    expensesData.forEach(({ date, category, amount, id }) => {
      const dateString = format(date, "yyyy-MM-dd");

      if (!expensesByDateAndCategory[dateString]) {
        expensesByDateAndCategory[dateString] = {};
      }
      if (!expensesByDateAndCategory[dateString][category]) {
        expensesByDateAndCategory[dateString][category] = {
          amount: 0,
          ids: [],
        };
      }
      expensesByDateAndCategory[dateString][category].amount += amount;
      expensesByDateAndCategory[dateString][category].ids.push(id);
    });

    const categoriesData = [...new Set(expensesData.map((expense) => expense.category))];
    const dates = Object.keys(expensesByDateAndCategory).sort();

    const datasets = categoriesData.map((category) => ({
      label: category,
      data: dates.map((date) => expensesByDateAndCategory[date][category]?.amount || 0),
      borderColor: categories.find((item) => item.name === category).color,
      fill: true,
      backgroundColor: hsl2Rgba(categories.find((item) => item.name === category).color, 0.2),
      expenseDetails: dates.map((date) =>
        expensesData
          .filter((item) => expensesByDateAndCategory[date][category]?.ids.includes(item.id))
          .map((item) => `${item.description} : ${item.amount}`)
      ),
    }));

    return { labels: dates, datasets };
  };

  const chartData = aggregateExpenses(expenses);
  const options = {
    scales: {
      x: {
        type: "time",
        // min: new Date("2024-01-01").valueOf(),
        // max: new Date("2024-01-31").valueOf(),
        time: {
          unit: "day",
          tooltipFormat: "MMM D",
        },
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          drawOnChartArea: true,
          color: function (context) {
            if (context.tick && context.tick.major) {
              return "rgba(0, 0, 0, 0.8)"; // color of major grid lines (year, month)
            } else {
              // Only draw the grid line if it's a Monday
              const value = context.tick.value;
              const date = new Date(value);
              const monday = startOfWeek(date, { weekStartsOn: 1 });
              return date.getTime() === monday.getTime() ? "rgba(0, 0, 0, 0.1)" : "rgba(0,0,0,0)";
            }
          },
        },
        /* ticks: {
          callback: function (val, index) {
            // Hide every 2nd tick label
            return index % 2 === 0 ? this.getLabelForValue(val) : "";
          },
        },
        /* */
      },
      y: {
        beginAtZero: true,
        // min: 0,
        // max: 100
        title: {
          display: true,
          text: "Expense Amount",
        },
      },
    },
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    /*
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        const expenseDetails = chartData.datasets[datasetIndex].expenseDetails[elementIndex];
        console.log(datasetIndex, elementIndex, expenseDetails);
      }
    },
    /* */
    plugins: {
      tooltip: {
        enabled: true,
        filter: (context) => context.raw !== 0, // Only show tooltip if amount is not zero
        backgroundColor: "#fff4e6",
        titleColor: "#ff922b",
        titleFont: {
          size: 12,
        },
        bodyColor: "#495057",
        bodyFont: {
          size: 11,
        },
        borderColor: "#ffa94d",
        borderWidth: 1,
        callbacks: {
          title: function (context) {
            return null;
            if (!context[0]) return;
            const date = context[0].label;
            const category = context[0].dataset.label;
            const amount = context[0].formattedValue;
            return `${category}=${amount}`;
          },
          label: function (context) {
            return null;
          },
          afterBody: (context) => {
            if (!context[0]) return;
            const date = context[0].label;
            const category = context[0].dataset.label;
            const details = context[0].dataset.expenseDetails[context[0].dataIndex];
            return details.length == 0 ? "nothing" : details;
          },
        },
      },
    },
  };

  return (
    <>
      <div>expensesChart</div>
      <Line data={chartData} options={options} />;
    </>
  );
};

export default ExpensesChart;
