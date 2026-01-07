import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PieChart = ({ title = "", data }) => {
  // Convert CSS gradient string to Highcharts SVG gradient object
  const parseGradient = (cssGradient) => {
    const colorMatches = cssGradient.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);
    if (!colorMatches || colorMatches.length < 2) {
      return colorMatches?.[0] || "#000"; // fallback to first color or black
    }

    return {
      linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 }, // left to right
      stops: [
        [0, colorMatches[0]],
        [1, colorMatches[1]],
      ],
    };
  };

  const processedData = data.map(({ name, y, datapointColor }) => ({
    name,
    y,
    color: parseGradient(datapointColor),
  }));

  const options = {
    chart: {
      type: "pie",
    },
    credits: {
      enabled: false
    },
    title: {
      text: title,
      style: {
        fontSize: "18px",
        fontFamily: "Poppins, sans-serif",
      },
    },
    legend: {
      enabled: true,
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      itemMarginTop: 8,
      itemMarginBottom: 8,
      itemStyle: {
        fontSize: "15px",
        fontFamily: "Poppins, sans-serif",
        fontWeight: "500",
        color: "#333",
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b> ({point.percentage:.3f}%)",
      style: {
        fontSize: "14px",
        fontFamily: "Poppins, sans-serif",
        fontWeight: "500",
        color: "#333",
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },

    plotOptions: {
      pie: {
        innerSize: "70%",
        allowPointSelect: true,
        cursor: "pointer",
        showInLegend: true,

        dataLabels: {
          enabled: false,
          format: "<b>{point.name}</b>: {point.y} ({point.percentage:.3f} %)",
          style: {
            fontSize: "14px",
            fontFamily: "Poppins, sans-serif",
            fontWeight: "500",
          },
        },
      },
    },
    series: [
      {
        name: "Count",
        colorByPoint: true,
        data: processedData,
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChart;
