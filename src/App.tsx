import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import About from "./pages/About";
import ExpensesLimit from "./pages/ExpensesLimit";

function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<About/>}></Route>
            <Route path="/about" element={<About/>}></Route>
            <Route path="/login" element={<ExpensesLimit/>}></Route>
            <Route path="/limit" element={<ExpensesLimit/>}></Route>
        </Routes>
      </Router>
  );
}

export default App;
