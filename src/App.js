import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import Dataset from "./pages/Dataset";
import { useState } from "react";
import "./App.css";



function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={ <Registration />}/>
          <Route path="/user-dashboard" element={<Dashboard />}/>
          <Route path="/user-dashboard/*" element={<Dashboard />}/>
          <Route path="/dataset/create-dataset" element={<Dataset/>}></Route>
        </Routes>
      </BrowserRouter>
      {/* <RouterProvider router={router}/> */}
    </div>
  );
}

export default App;
