import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/register" element={<Registration/>}></Route>
      </Routes>
    </BrowserRouter>
      

    </div>
  )
}

export default App
