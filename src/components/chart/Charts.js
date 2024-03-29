import React from "react";
import Chart from 'chart.js/auto';      //eslint-disable-line
import { Pie, Bar, Line } from "react-chartjs-2";
import { formatDate } from "../../constants/functions";

const defSubtitle = { text: 'Please pass a subtitle.', font: { size: 12, family: 'tahoma, Ariel, sans-serif', weight: 'normal', style: 'italic', }, color: '#000', padding: { top: 5, bottom: 5 } };
const defTitle = { text: 'Please pass a title.', font: { size: 12, family: 'tahoma, Ariel, sans-serif', weight: 'normal', style: 'italic' }, color: '#00AAAA', padding: { top: 5, bottom: 5 } };
export function PieChart({ chartData, title = defTitle, subtitle = defSubtitle, chartClass = 'chart-pie-container' }) {
    return (
        <div className={chartClass}>
            <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
            <Pie
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: title.text,
                            color: title.color,
                        },
                        subtitle: {
                            display: subtitle.text ? true : false,
                            text: subtitle.text,
                            color: subtitle.color,
                            font: subtitle.font,
                            padding: subtitle.padding,
                        },
                        legend: {
                            display: false
                        }
                    }
                }}
            />
        </div>
    );
};

export function BarChart({ chartData, title = defTitle, subtitle = defSubtitle, chartClass = 'chart-bar-container', label }) {
    const data = {
        labels: chartData.map((data) => data.date),
        datasets: [{
            label: label,
            data: chartData.map((data) => data.memoryLeft),
            backgroundColor: [
                "rgba(75,192,192,1)",
                "#50AF95",
                "#a31a2f",
                "#af5a2f",
                "#f3ba2f",
                "#ffffff"
            ],
            borderColor: "black",
            borderWidth: 2
        }],
    }

    return (
        <div className={chartClass}>
            <Bar
                data={data}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: title.text,
                            color: title.color,
                        },
                        subtitle: {
                            display: subtitle.text ? true : false,
                            text: subtitle.text,
                            color: subtitle.color,
                            font: subtitle.font,
                            padding: subtitle.padding,
                        },
                        legend: {
                            display: false
                        }
                    }
                }}
            />
        </div>
    );
};

export function LineChart({ chartData, isCapacity = true, title = 'Please pass a title.', subtitle = defSubtitle, chartClass = 'chart-bar-container', label, maxY = 100, isXZero = false, isYZero = false }) {
    let data;
    if (chartData !== undefined)
        data = {
            labels: chartData.map((data) => formatDate(data.checkedAt, false, false)),
            datasets: [{
                label: label,
                data: chartData.map((data) => {
                    if (isCapacity && data.capacityLeft) {
                        return (100 - data.capacityPercent);
                    } else {
                        if (data.freeMemory) {
                            return (100 - data.memoryPercent);
                        } else {
                            if (data.status === 200 || data.isActive) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    }

                }),
                backgroundColor: [
                    '#ABCDEF',
                ],
                borderColor: "#1F4268",
                borderWidth: 0.5,
            }],
        };

    if (chartData !== undefined) return (
        <div className={chartClass} >
            <Line
                data={data}
                options={{
                    scales: {
                        y: {
                            beginAtZero: isYZero,
                            stepSize: 10,
                            max: maxY,
                        },
                        x: {
                            beginAtZero: isXZero,
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: title.text,
                            color: title.color,
                        },
                        subtitle: {
                            display: subtitle.text ? true : false,
                            text: subtitle.text,
                            color: subtitle.color,
                            font: subtitle.font,
                            padding: subtitle.padding,
                        },
                        legend: {
                            display: false
                        },
                    }
                }}
            />
        </div>
    );
    else return (
        <div className={chartClass}>
            Not enough data to make a chart
        </div>
    );
};
