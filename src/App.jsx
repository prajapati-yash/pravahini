import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
    <Router>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Registration/>}/>
        <Route path="/user-dashboard" element={<Dashboard/>}></Route>
        <Route path="/user-dashboard/*" element={<Dashboard/>}></Route>
      </Routes>
    </Router>
      

    </div>
  )
}

export default App
