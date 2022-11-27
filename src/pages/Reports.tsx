import budgetAppLogo from "../components/budget planner-logos_transparent.png";
import React, {useEffect, useState} from "react";
import {signOut} from "firebase/auth";
import {auth, db} from "../Firebase";
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
import {Pie} from "react-chartjs-2";
import {useAuthState} from "react-firebase-hooks/auth";
import {onValue, ref} from "firebase/database";
import '../pages/Reports.css';
import CategoryPieChart from "./reports/CategoryPieChart";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        }
    },
};

export const data = {
    labels: [""],
    datasets: [
        {
            label: 'Dataset 1',
            data: [],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

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

function Reports() {
    const logout = async () => {
        await signOut(auth);
    }
    const [user, loading] = useAuthState(auth);
    // const [repData, setRepData] = useState(reportData);
    // const [repDataReady, setRepDataReady] = useState(false);
    // const [isCategoryPieChart, setCategoryPieChart] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('pie-chart');
    const [pieData, setPieData] = useState({});
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
            // setRepData(newData);
            // setRepDataReady(true);
        });
    }, [loading]);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = {
            "startDate": startDate,
            "endDate": endDate,
            "reportType": reportType,
        };
        setPieData(data);
    }


    return (
        <>
            <ul className="nav-ul">
                <li className="li-left"><img height="55px" src={budgetAppLogo}/></li>
                <li className="li-right"><a className="li-anchor" onClick={logout} href="/">LOGOUT</a></li>
                <li className="li-right"><a className="li-anchor" href="/dashboard">DASHBOARD</a></li>
                <li className="li-right"><a className="li-anchor" href="/about">ABOUT</a></li>
            </ul>

            <h1 id="pie">VIEW REPORT</h1>

            <form onSubmit={handleSubmit}>
                <br/>
                <br/>
                <p>Start Date</p>
                <input type="date" name="date_picker" value={startDate} onChange={event => setStartDate(event.target.value)} required />
                <br/>
                <p>End Date</p>
                <input type="date" name="date_picker" value={endDate} onChange={event => setEndDate(event.target.value)} required />
                <br/>
                <p>Report Type</p>
                <select value={reportType} onChange={event => setReportType(event.target.value)} >
                    <option value="pie-chart">Category Wise Pie Chart</option>
                    <option value="line-chart">Category Wise Line Chart</option>
                </select>

                <button type="submit">Submit</button>
            </form>

            <div>
                <CategoryPieChart data={pieData} />
                {/*{!isCategoryPieChart ? (<></>) : (<CategoryPieChart data={pieData}/>)}*/}
            </div>

            {/*<div className="center-div">*/}
            {/*    <div className="row">*/}
            {/*        <div className="reports-column">*/}
            {/*            <div className="card">*/}
            {/*                <div className="pie-div">*/}
            {/*                    {!repDataReady ? (<></>) : (<Pie className="pie-chart" data={repData}/>)}*/}
            {/*                </div>*/}
            {/*                <p>Pie Chart: Category Wise Spend</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    );
}

export default Reports