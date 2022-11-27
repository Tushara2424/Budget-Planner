import React, {useEffect, useState} from "react";
import {signOut} from "firebase/auth";
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
import { Pie } from "react-chartjs-2";
import {useAuthState} from "react-firebase-hooks/auth";
import {ref, onValue} from "firebase/database";
import "./CategoryPieChart.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

export const reportData = {
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
    }
};

function CategoryPieChart(props: any) {
    const [user, loading] = useAuthState(auth);
    const [repData, setRepData] = useState(reportData);
    const [repDataReady, setRepDataReady] = useState(false);
    let userId:any;

    useEffect(() => {
        if (loading) {
            return;
        }
        userId = user?.uid;
        const categoriesRef = ref(db, `users/${userId}/categories`);
        onValue(categoriesRef, (snapshot) => {
            let newData = reportData;
            let labels = [];
            let datasets = [];
            const catData = snapshot.val();
            for (const key in catData) {
                labels.push(key);
                datasets.push(catData[key]);
            }
            newData.labels = labels;
            newData.datasets[0].data = datasets;
            setRepData(newData);
            setRepDataReady(true);
        });
    }, [loading]);

    if (props.data.reportType != "pie-chart") {
        return (<></>);
    }


    return (
        <>
            <div className="center-div">
                <div className="row">
                    <div className="reports-column">
                        <div className="card">
                            <div className="pie-div">
                                {!repDataReady ? (<></>) : (<Pie className="pie-chart" data={repData}/>)}
                            </div>
                            <p>Pie Chart: Category Wise Spend</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CategoryPieChart