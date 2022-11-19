import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../Firebase";
import "./Dashboard.css";
import budgetAppLogo from "../components/budget planner-logos_transparent.png";
import addExpensesLogo from "../components/add expenses-logos/add expenses-logos.jpeg";
import viewReportLogo from "../components/add expenses-logos/view-report.jpg";
import addBillsLogo from "../components/add expenses-logos/add-bills.jpg";
import setLimitLogo from "../components/add expenses-logos/set-limits.jpg";
import React from "react";
import {signOut} from "firebase/auth";

function Dashboard() {
    const [user] = useAuthState(auth);
    const logout = async () => {
        await signOut(auth);
    }

    return (
        <>
            <ul className="nav-ul">
                <li className="li-left"><img height="55px" src={budgetAppLogo}/></li>
                <li className="li-right"><a className="li-anchor" onClick={logout} href="/">LOGOUT</a></li>
                <li className="li-right"><a className="li-anchor" href="/dashboard">DASHBOARD</a></li>
                <li className="li-right"><a className="li-anchor" href="/about">ABOUT</a></li>
            </ul>
            <div className="header">
                <p>Welcome to the dashboard, <b>{user?.displayName}</b></p>
                {/*create card UI to show different options - add expenses, limit, bills, etc*/}
            </div>

            <br/>
            <br/>

            <div className="row">
                <div className="column">
                    <div className="card">
                        <a href="/expenses">
                            <img src={addExpensesLogo} alt="Avatar" width="100%"/>
                        </a>
                        <p>Record Monthly Expenses</p>
                    </div>
                </div>

                <div className="column">
                    <div className="card">
                        <a href="/limits">
                            <img src={setLimitLogo} alt="Avatar" width="100%"/>
                        </a>
                        <p>Set Limits For Expenses</p>
                    </div>
                </div>

                <div className="column">
                    <div className="card">
                        <a href="/reports">
                            <img src={viewReportLogo} alt="Avatar" width="100%"/>
                        </a>
                        <p>View Report For Expenses</p>
                    </div>
                </div>

                <div className="column">
                    <div className="card">
                        <a href="/bills">
                            <img src={addBillsLogo} alt="Avatar" width="100%"/>
                        </a>
                        <p>Add Monthly Bills To Be Paid</p>
                    </div>
                </div>
            </div>
        </>
);
}

export default Dashboard