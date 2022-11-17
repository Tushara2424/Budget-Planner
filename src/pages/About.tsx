import React from 'react';
import './About.css';
import menuOptions from '../components/menu-button-of-three-horizontal-lines.png';
import budgetAppLogo from '../components/budget planner-logos_transparent.png';

function About() {
    return (
        <>
            <ul className="nav-ul">
                <li className="li-left"><img height="55px" src={budgetAppLogo}/></li>
                <li className="li-right"><a className="li-anchor" href="/login">LOGIN</a></li>
                <li className="li-right"><a className="li-anchor" href="/about">ABOUT</a></li>
            </ul>
            <div className="text-block">
                <div>
                    <h1 className="text-dark">
                        Are you ready to <br /> <strong className="text-light"> maximize </strong> your savings?
                    </h1>
                </div>

                <div className="text-block">
                    <br />
                    <ul>
                        <li className="list-items">Easy to use interface</li>
                        <li className="list-items">Set expenses limit and get alerts</li>
                        <li className="list-items">Track and monitor expenses using dashboards</li>
                        <li className="list-items">Dedicated support for tracking bills</li>
                        <li className="list-items">User authentication</li>
                    </ul>
                    <br/>
                </div>

                <div>
                    <h4 className="text-dark text-hover">
                        Join now!!!
                    </h4>
                </div>
            </div>
            <footer>
                <p>Contact - budgetplanner@gwu.edu </p>
            </footer>
        </>
    );
}

export default About
