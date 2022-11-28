import React, {useEffect, useState} from "react";
import {auth, db} from "../../Firebase";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement, Title
} from "chart.js";
import { Line } from "react-chartjs-2";
import {useAuthState} from "react-firebase-hooks/auth";
import {ref, onValue} from "firebase/database";
import "./DateWiseLineChart.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

export const dateLineChartData = {
    datasets: [
        {
            label: 'Amount Spent',
            data: [{}],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 2,
            tension: 0.1,
        },
    ],
    options: {
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                }
            }
        }
    }
};

function getSortedData(unordered: {}) {
    const ordered = Object.keys(unordered).sort().reduce(
        (obj, key) => {
            // @ts-ignore
            obj[key] = unordered[key];
            return obj;
        },
        {}
    );
    return ordered;
}

function DateLineChart(props: any) {
    const [user, loading] = useAuthState(auth);
    const [repData, setRepData] = useState(dateLineChartData);
    const [repDataReady, setRepDataReady] = useState(false);
    let userId:any;

    useEffect(() => {
        if (loading) {
            return;
        }
        userId = user?.uid;
        const expensesRef = ref(db, `users/${userId}/expenses`);
        onValue(expensesRef, (snapshot) => {
            let dateWiseData: any = {};
            let tempData = dateLineChartData;
            let dateData = [];
            const expensesRow = snapshot.val();

            for (const id in expensesRow) {
                const rowData = expensesRow[id];
                const ts = Date.parse(rowData["date"]);
                const startTs = Date.parse(props.data.startDate);
                const endTs = Date.parse(props.data.endDate);
                if (ts >= startTs && ts <= endTs) {
                    let date = rowData["date"];
                    let amount = Number(rowData["amount"]);
                    let currentAmt = dateWiseData[date];
                    currentAmt = isNaN(currentAmt) ? amount : currentAmt + amount;
                    dateWiseData[date] = currentAmt;
                }
            }
            dateWiseData = getSortedData(dateWiseData);
            for (const date in dateWiseData) {
                let details = {
                    x: date,
                    y: dateWiseData[date]
                }
                dateData.push(details);
            }

            tempData.datasets[0].data = dateData;
            setRepData(tempData);
            setRepDataReady(true);
        });
    }, [loading, props]);

    if (props.data.reportType != "date-line-chart") {
        return (<></>);
    }

    return (
        <>
            <div className="center-div">
                <div className="row">
                    <div className="reports-column">
                        <div className="card">
                            <div className="date-line-div">
                                {!repDataReady ? (<></>) : (<Line key={Math.random()} className="line-chart" data={repData} redraw />)}
                            </div>
                            <p>Line Chart: Date Wise Spent</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DateLineChart