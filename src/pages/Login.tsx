import React, {useEffect} from "react";
import './Login.css'
import budgetAppLogo from "../components/budget planner-logos_transparent.png";
import {auth, signInWithGoogle} from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {
    const [user, loading] = useAuthState(auth);
    useEffect(() => {
        if (loading) {
            return;
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
                    <div id="card-title">
                        <h2>Budget Planner</h2>
                    </div>
                    <button id="submit-btn" onClick={signInWithGoogle}>
                        SIGN IN WITH GOOGLE
                    </button>
                </div>
            </div>
        </>
    )
}

export default Login
