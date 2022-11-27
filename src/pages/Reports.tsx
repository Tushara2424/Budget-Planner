import budgetAppLogo from "../components/budget planner-logos_transparent.png";
import React, {useEffect, useState} from "react";
import {signOut} from "firebase/auth";
import {auth} from "../Firebase";
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
import {useAuthState} from "react-firebase-hooks/auth";
import {onValue, ref} from "firebase/database";
import '../pages/Reports.css';
import CategoryPieChart from "./reports/CategoryPieChart";
import CategoryLineChart from "./reports/CategoryLineChart";
import CategoryBarChart from "./reports/CategoryBarChart";
import DateWiseLineChart from "./reports/DateWiseLineChart";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

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
    const [finalRepData, setFinalRepData] = useState({});
    const [submitValue, setSubmitValue] = useState(false);
    // let userId:any;

    useEffect(() => {
        if (loading) {
            return;
        }
        // userId = user?.uid;
        // const categoriesRef = ref(db, `users/${userId}/categories`);
        // onValue(categoriesRef, (snapshot) => {
            // let newData = reportData;
            // let labels = [];
            // let datasets = [];
            // const catData = snapshot.val();
            // for (const key in catData) {
                // labels.push(key);
                // datasets.push(catData[key]);
            // }
            // newData.labels = labels;
            // newData.datasets[0].data = datasets;
            // setRepData(newData);
            // setRepDataReady(true);
        // });
    }, [loading]);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = {
            "startDate": startDate,
            "endDate": endDate,
            "reportType": reportType,
        };
        setFinalRepData(data);
        setSubmitValue(true);
    }


    return (
        <>
            <ul className="nav-ul">
                <li className="li-left"><img height="55px" src={budgetAppLogo}/></li>
                <li className="li-right"><a className="li-anchor" onClick={logout} href="/">LOGOUT</a></li>
                <li className="li-right"><a className="li-anchor" href="/dashboard">DASHBOARD</a></li>
                <li className="li-right"><a className="li-anchor" href="/about">ABOUT</a></li>
            </ul>

            <h1 className="heading">VIEW REPORT</h1>
            <br/>
            <br/>

            <form onSubmit={handleSubmit}>
                <br/>
                <p>Start Date</p>
                <input type="date" name="date_picker" value={startDate} onChange={event => setStartDate(event.target.value)} required />
                <br/>
                <p>End Date</p>
                <input type="date" name="date_picker" value={endDate} onChange={event => setEndDate(event.target.value)} required />
                <br/>
                <p>Report Type</p>
                <select className="report-select" value={reportType} onChange={event => setReportType(event.target.value)} >
                    <option value="pie-chart">Category Wise Pie Chart</option>
                    <option value="line-chart">Category Wise Line Chart</option>
                    <option value="bar-chart">Category Wise Bar Chart</option>
                    <option value="date-line-chart">Date Wise Line Chart</option>
                </select>

                <button type="submit">Submit</button>
            </form>

            <div>
                {submitValue ? (<CategoryPieChart data={finalRepData} />) : (<></>)}
                {submitValue ? (<CategoryLineChart data={finalRepData} />) : (<></>)}
                {submitValue ? (<CategoryBarChart data={finalRepData} />) : (<></>)}
                {submitValue ? (<DateWiseLineChart data={finalRepData} />) : (<></>)}
                {/*<CategoryPieChart data={finalRepData} />*/}
                {/*{!isCategoryPieChart ? (<></>) : (<CategoryPieChart data={pieData}/>)}*/}
            </div>
        </>
    );
}

export default Reports