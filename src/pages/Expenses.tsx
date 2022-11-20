import React, {useState} from 'react';
import budgetAppLogo from "../components/budget planner-logos_transparent.png";
import {auth, db} from "../Firebase";
import {signOut} from "firebase/auth";
import {set, ref, push} from "firebase/database";
import "./Expenses.css";
import {useAuthState} from "react-firebase-hooks/auth";

function Expenses() {
    const [user] = useAuthState(auth);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('other');
    const handleSubmit = (event: any) => {
        event.preventDefault();
        setDescription('');
        setAmount('');
        const userId = user?.uid;
        const ts = Date.now();
        const value = {
            "category": category,
            "description": description,
            "amount": amount,
            "ts": ts
        }
        const expensesRef = push(ref(db, `users/${userId}/expenses`));
        set(expensesRef, value)
            .then(() => console.log("data added to db"))
            .catch(() => console.log("error while adding to db"));
    };

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

            <h1>ADD EXPENSES</h1>

            <form onSubmit={handleSubmit}>
                <p>Please select expense details to add: </p>
                <br/>
                <br/>
                <p>Select Category</p>
                <select value={category} onChange={event => setCategory(event.target.value)}>
                    <option value="other">Other</option>
                    <option value="grocery">Food</option>
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
                <p>Description</p>
                <input
                    id="description"
                    name="description"
                    type="text"
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    required
                />
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

export default Expenses
