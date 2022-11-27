import React, {useEffect, useState} from "react";
import './Login.css'
import budgetAppLogo from "../components/budget planner-logos_transparent.png";
import {auth, signInWithGoogle} from "../Firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) {
            navigate("/dashboard");
        }
    }, [user, loading]);

    return (
        <>
            <ul className="nav-ul">
                <li className="li-left"><img height="55px" src={budgetAppLogo}/></li>
                <li className="li-right"><a className="li-anchor" href="/login">LOGIN</a></li>
                <li className="li-right"><a className="li-anchor" href="/about">ABOUT</a></li>
            </ul>

            <div id="card">
                <div id="card-content">
                    <h1 className="center-align">Login Options</h1>
                    <div className="center-align">
                        <button type="button" onClick={signInWithGoogle} className="login-with-google-btn">
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

function GetCurrentLoginState() {
    const [user, loading] = useAuthState(auth);
    useEffect(() => {
        if (loading) {
            return;
        }
    }, [user, loading]);

    if (user) {
        return (
            <>
                <li className="li-right"><a className="li-anchor" href="/dashboard">DASHBOARD</a></li>
                <li className="li-right"><a className="li-anchor" href="/logout">LOGOUT</a></li>
            </>
        );
    } else {
        return (
            <li className="li-right"><a className="li-anchor" href="/login">LOGIN</a></li>
        );
    }
}

export default Login
export const currentUser = GetCurrentLoginState;
