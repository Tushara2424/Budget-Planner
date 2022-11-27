import React, {useState} from 'react'
import {auth, db} from "../Firebase";
import budgetAppLogo from "../components/budget planner-logos_transparent.png";
import {signOut} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {ref, get, set} from "firebase/database";

function Bills() {
    const logout = async () => {
        await signOut(auth);
    }
    const [user] = useAuthState(auth);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('other');
    const [description, setDescription] = useState('');
    const userId = user?.uid;
    const limitsRef = ref(db, `users/${userId}/limits`);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        setAmount('');
        // todo@pranit
    };
    return (
        <>
            <ul className="nav-ul">
                <li className="li-left"><img height="55px" src={budgetAppLogo}/></li>
                <li className="li-right"><a className="li-anchor" onClick={logout} href="/">LOGOUT</a></li>
                <li className="li-right"><a className="li-anchor" href="/dashboard">DASHBOARD</a></li>
                <li className="li-right"><a className="li-anchor" href="/about">ABOUT</a></li>
            </ul>

            <h1 className="heading">ADD BILLS</h1>
            <br/>
            <br/>

            <form onSubmit={handleSubmit}>
                <p>Please add monthly bills to pay: </p>
                <br/>
                <p>Bill Description</p>
                <input
                    id="description"
                    name="description"
                    type="text"
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    required
                />
                <br/>
                <p>Bill Amount in USD</p>
                <input
                    id="amount"
                    name="amount"
                    type="number"
                    value={amount}
                    onChange={event => setAmount(event.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </>
    );
}

export default Bills
