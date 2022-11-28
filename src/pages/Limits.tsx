import React, {useState} from 'react'
import {auth, db} from "../Firebase";
import budgetAppLogo from "../components/budget planner-logos_transparent.png";
import {signOut} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {ref, get, set} from "firebase/database";

function Limits() {
    const logout = async () => {
        await signOut(auth);
    }
    const [user] = useAuthState(auth);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('other');
    const userId = user?.uid;
    const limitsRef = ref(db, `users/${userId}/limits`);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        setAmount('');
        let currentLimit = {};
        get(limitsRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    currentLimit = snapshot.val();
                }
                // @ts-ignore
                currentLimit[category] = amount;
                set(limitsRef, currentLimit)
                    .then(() => alert("Limit added successfully"))
                    .catch(() => console.log("error while adding to db"));
            })
            .catch(() => alert("Error while adding limit"));
    };
    return (
        <>
            <ul className="nav-ul">
                <li className="li-left"><img height="55px" src={budgetAppLogo}/></li>
                <li className="li-right"><a className="li-anchor" onClick={logout} href="/">LOGOUT</a></li>
                <li className="li-right"><a className="li-anchor" href="/dashboard">DASHBOARD</a></li>
                <li className="li-right"><a className="li-anchor" href="/about">ABOUT</a></li>
            </ul>

            <h1 className="heading">SET LIMITS</h1>
            <br/>
            <br/>

            <form onSubmit={handleSubmit}>
                <p>Please set monthly expense limit category wise: </p>
                <br/>
                <p>Select Category</p>
                <select value={category} onChange={event => setCategory(event.target.value)}>
                    <option value="other">Other</option>
                    <option value="grocery">Grocery</option>
                    <option value="housing">Housing</option>
                    <option value="utilities">Utilities</option>
                    <option value="clothing">Clothing</option>
                    <option value="medical">Medical</option>
                    <option value="transportation">Transportation</option>
                    <option value="household_items">Household Items</option>
                    <option value="personal">Personal</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                </select>
                <br/>
                <p>Amount in USD</p>
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

export default Limits
