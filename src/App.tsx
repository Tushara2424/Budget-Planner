import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import About from "./pages/About";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Limits from "./pages/Limits";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Bills from "./pages/Bills";

function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<About/>}></Route>
            <Route path="/about" element={<About/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/dashboard" element={<Dashboard/>}></Route>
            <Route path="/limits" element={<Limits/>}></Route>
            <Route path="/reports" element={<Reports/>}></Route>
            <Route path="/expenses" element={<Expenses/>}></Route>
            <Route path="/bills" element={<Bills/>}></Route>
        </Routes>
      </Router>
  );
}

export default App;
