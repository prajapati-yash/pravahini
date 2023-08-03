<<<<<<< HEAD
import { BrowserRouter, Route, Routes } from "react-router-dom";
=======
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
>>>>>>> 21d6b11b39e49e2661548afd6b7564060e753aa7
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
<<<<<<< HEAD
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" render={()=> <Registration />}/>
          <Route path="/user-dashboard" element={<Dashboard />}></Route>
          <Route path="/user-dashboard/*" element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
=======
    <Router>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Registration/>}/>
        <Route path="/user-dashboard" element={<Dashboard/>}></Route>
        <Route path="/user-dashboard/*" element={<Dashboard/>}></Route>
      </Routes>
    </Router>
      

>>>>>>> 21d6b11b39e49e2661548afd6b7564060e753aa7
    </div>
  );
}

export default App;
