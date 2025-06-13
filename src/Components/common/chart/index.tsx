/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DynamicChartProps } from "@/util/interface/props";

const DynamicChart: React.FC<DynamicChartProps> = ({
  type = "line",
  series = [],
  width = "100%",
  height = 350,
  title = "",
  subtitle = "",
  colors = [],
  options = {},
  className = "",
}) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (type === "line" || type === "bar") {
      if (series.length > 0 && Array.isArray(series[0].data)) {
        const categories =
          options.xaxis?.categories ||
          Array.from({ length: series[0].data.length }, (_, i) => i.toString());

        const newData = categories.map((category: any, index: any) => {
          const dataPoint: any = { name: category };
          series.forEach((s) => {
            dataPoint[s.name] = s.data[index];
          });
          return dataPoint;
        });

        setChartData(newData);
      }
    } else if (type === "pie") {
      const labels =
        options.labels || series.map((_, i) => `Category ${i + 1}`);
      setChartData(
        series.map((value, index) => ({
          name: labels[index],
          value,
        }))
      );
    }
  }, [type, series, options]);

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width={width} height={height}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {series.map((s, index) => (
                <Line
                  key={s.name}
                  type="monotone"
                  dataKey={s.name}
                  stroke={
                    colors?.[index] ||
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`
                  }
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width={width} height={height}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {series.map((s, index) => (
                <Bar
                  key={s.name}
                  dataKey={s.name}
                  fill={
                    colors?.[index] ||
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width={width} height={height}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      colors?.[index] ||
                      `#${Math.floor(Math.random() * 16777215).toString(16)}`
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className={className}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      {renderChart()}
    </div>
  );
};

export default DynamicChart;
