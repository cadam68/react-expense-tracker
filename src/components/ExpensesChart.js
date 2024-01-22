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
import { format, startOfWeek, addDays } from "date-fns";
import { hsl2Rgba } from "../services/Helper";
import { sortExpensesBy } from "../services/ExpensesService";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler);

/*
const transformData = (expenses, categories) => {
  const expensesByDateAndCategory = {};

  expenses.forEach(({ date, category, amount, id }) => {
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

  const categoriesData = [...new Set(expenses.map((expense) => expense.category))];
  const dates = Object.keys(expensesByDateAndCategory).sort();

  const datasets = categoriesData.map((category) => ({
    label: category,
    data: dates.map((date) => expensesByDateAndCategory[date][category]?.amount || 0),
    borderColor: categories.find((item) => item.name === category).color,
    fill: true,
    backgroundColor: hsl2Rgba(categories.find((item) => item.name === category).color, 0.2),
    expenseDetails: dates.map((date) =>
      expenses
        .filter((item) => expensesByDateAndCategory[date][category]?.ids.includes(item.id))
        .map((item) => `${item.description} : ${item.amount}`)
    ),
  }));

  return { labels: dates, datasets };
};
/* */

const transformData = (expenses, categories, cumulAmount = true) => {
  const expensesData = {};

  const categoriesData = [...new Set(expenses.map((expense) => expense.category))];
  sortExpensesBy(expenses, "chart").forEach(({ date, category, amount, id }) => {
    const dateString = format(date, "yyyy-MM-dd");

    if (!expensesData[category]) expensesData[category] = {};
    if (!expensesData[category][dateString]) {
      expensesData[category][dateString] = {
        amount: 0,
        ids: [],
      };
    }
    expensesData[category][dateString].amount += amount;
    expensesData[category][dateString].ids.push(id);
  });

  // add gape dates
  const dateArray = expenses.map((item) => item.date).sort((a, b) => a - b);
  for (let currentDate = dateArray.at(0); currentDate <= dateArray.at(-1); currentDate = addDays(currentDate, 1)) {
    let dateString = format(currentDate, "yyyy-MM-dd");
    categoriesData.forEach((category) => {
      if (!expensesData[category][dateString]) {
        expensesData[category][dateString] = {
          amount: 0,
          ids: [],
        };
      }
    });
  }

  const datasets = categoriesData.map((category) => ({
    label: category,
    data: (() => {
      const dates = Object.keys(expensesData[category]).sort();
      return dates.map((date) => ({
        x: date,
        y: expensesData[category][date].amount,
        expenseIds: expensesData[category][date].ids,
        details: expenses
          .filter((item) => expensesData[category][date].ids.includes(item.id))
          .map((item) => `${item.description} : ${item.amount}`),
      }));
    })(),
    borderColor: categories.find((item) => item.name === category).color,
    fill: true,
    backgroundColor: hsl2Rgba(categories.find((item) => item.name === category).color, 0.2),
  }));

  // cumulating the amounts
  if (cumulAmount)
    datasets.forEach((dataset) => {
      if (dataset.data.length > 1) for (let i = 1; i < dataset.data.length; i++) dataset.data[i].y += dataset.data[i - 1].y;
    });
  /* */

  return { datasets };
};

const ExpensesChart = ({ expenses, categories }) => {
  const chartData = transformData(expenses, categories);
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
        const data = chartData.datasets[datasetIndex].data[elementIndex];
        console.log(data);
      }
    },
    /* */
    plugins: {
      tooltip: {
        enabled: true,
        filter: (context) => {
          return context.raw.y !== 0 && context.raw.details.length !== 0;
        }, // Only show tooltip if amount is not zero
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
          title: (context) => null,
          label: (context) => null,
          afterBody: (context) => context[0]?.raw?.details,
        },
      },
    },
  };

  // console.log(chartData);

  return (
    <>
      <div>Expenses Chart</div>
      <Line data={chartData} options={options} />;
    </>
  );
};

export default ExpensesChart;
