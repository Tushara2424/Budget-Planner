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
    BarElement,
    LineElement, Title
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {useAuthState} from "react-firebase-hooks/auth";
import {ref, onValue, push} from "firebase/database";
import "./CategoryBarChart.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

export const barChartData = {
    labels: [""],
    datasets: [
        {
            label: 'Amount Spent',
            data: [0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 2,
        },
    ],
    options: {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

function capitalizeFirstLetter(str: string) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return str.replace(/_/g, ' ');
}

function CategoryBarChart(props: any) {
    const [user, loading] = useAuthState(auth);
    const [repData, setRepData] = useState(barChartData);
    const [repDataReady, setRepDataReady] = useState(false);
    let userId:any;

    useEffect(() => {
        if (loading) {
            return;
        }
        userId = user?.uid;
        const expensesRef = ref(db, `users/${userId}/expenses`);
        onValue(expensesRef, (snapshot) => {
            let categoryWiseData: any = {};
            let tempData = barChartData;
            let labels = [];
            let datasets = [];
            const expensesRow = snapshot.val();

            for (const id in expensesRow) {
                const rowData = expensesRow[id];
                const ts = Date.parse(rowData["date"]);
                const startTs = Date.parse(props.data.startDate);
                const endTs = Date.parse(props.data.endDate);
                if (ts >= startTs && ts <= endTs) {
                    let category = capitalizeFirstLetter(rowData["category"]);
                    let amount = Number(rowData["amount"]);
                    let currentAmt = categoryWiseData[category];
                    currentAmt = isNaN(currentAmt) ? amount : currentAmt + amount;
                    categoryWiseData[category] = currentAmt;
                }
            }
            for (const cat in categoryWiseData) {
                labels.push(cat);
                datasets.push(categoryWiseData[cat]);
            }
            tempData.labels = labels;
            tempData.datasets[0].data = datasets;
            setRepData(tempData);
            setRepDataReady(true);
        });
    }, [loading, props]);

    if (props.data.reportType != "bar-chart") {
        return (<></>);
    }

    return (
        <>
            <div className="center-div">
                <div className="row">
                    <div className="reports-column">
                        <div className="card">
                            <div className="bar-div">
                                {!repDataReady ? (<></>) : (<Bar className="bar-chart" data={repData} redraw />)}
                            </div>
                            <p>Bar Chart: Category Wise Spent</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CategoryBarChart