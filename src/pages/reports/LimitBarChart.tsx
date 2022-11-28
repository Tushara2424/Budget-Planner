import React, {useEffect, useState} from "react";
import {auth, db} from "../../Firebase";
import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import {Bar} from "react-chartjs-2";
import {useAuthState} from "react-firebase-hooks/auth";
import {get, ref} from "firebase/database";
import "./LimitBarChart.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

export const limitBarChartData = {
    labels: [""],
    datasets: [
        {
            label: 'Percentage of Limit Spent',
            data: [0],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 2,
            tension: 0.1,
        },
    ],
    options: {
        maintainAspectRatio: false,
    }
};

function capitalizeFirstLetter(str: string) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return str.replace(/_/g, ' ');
}

function LimitBarChart(props: any) {
    const [user, loading] = useAuthState(auth);
    const [repData, setRepData] = useState(limitBarChartData);
    const [repDataReady, setRepDataReady] = useState(false);
    const [limitData, setLimitData] = useState<{[key: string]: number}>({});
    let userId:any;

    useEffect(() => {
        if (loading) {
            return;
        }
        userId = user?.uid;
        const limitsRef = ref(db, `users/${userId}/limits`);

        get(limitsRef)
            .then((snap) => {
                if (snap.exists()) {
                    const limitsRows = snap.val();
                    let tempLimit: {[key: string]: number} = {};
                    for (let limitCategory in limitsRows) {
                        const limitAmt = limitsRows[limitCategory];
                        limitCategory = capitalizeFirstLetter(limitCategory);
                        tempLimit[limitCategory] = limitAmt;
                    }
                    setLimitData(tempLimit);

                    const expensesRef = ref(db, `users/${userId}/expenses`);
                    get(expensesRef)
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                let categoryWiseSpent: {[key: string]: number} = {};
                                let tempData =limitBarChartData;
                                let labels: string[] = [];
                                let datasets: number[] = [];
                                const expensesRow = snapshot.val();
                                for (const id in expensesRow) {
                                    const rowData = expensesRow[id];
                                    const ts = Date.parse(rowData["date"]);
                                    let date = new Date();
                                    let firstDayOfMonth = Date.parse((new Date(date.getFullYear(), date.getMonth(), 1).toDateString()));
                                    let lastDayOfMonth = Date.parse((new Date(date.getFullYear(), date.getMonth() + 1, 0)).toDateString());

                                    if (ts >= firstDayOfMonth && ts <= lastDayOfMonth) {
                                        let category = capitalizeFirstLetter(rowData["category"]);
                                        let currentAmt = categoryWiseSpent[category];
                                        categoryWiseSpent[category] = isNaN(currentAmt) ? Number(rowData["amount"]) : Number(rowData["amount"]) + Number(currentAmt);
                                    }
                                }

                                for (const cat in tempLimit) {
                                    if (categoryWiseSpent[cat] != undefined) {
                                        console.log(tempLimit);
                                        console.log(categoryWiseSpent)
                                        const percent: number = (Number(categoryWiseSpent[cat])/Number(tempLimit[cat]))*(100);
                                        labels.push(cat);
                                        datasets.push(percent);
                                    }
                                }
                                tempData.labels = labels;
                                tempData.datasets[0].data = datasets;
                                setRepData(tempData);
                                setRepDataReady(true);
                            }
                        })
                }
            })
    }, [loading, props, repData]);

    if (props.data.reportType != "limit-bar-chart") {
        return (<></>);
    }

    return (
        <>
            <div className="center-div">
                <div className="row">
                    <div className="reports-column">
                        <div className="card">
                            <div className="line-div">
                                {!repDataReady ? (<></>) : (<Bar className="line-chart" data={repData} />)}
                            </div>
                            <p>Bar Chart: Category Wise Percent Limit Spent</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LimitBarChart