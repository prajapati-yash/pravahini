// import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import "./App.css";


const router = createBrowserRouter([
  {path:"/", element:<Home/>},{path:"/register", element:<Registration/>},{path:"/user-dashboard", element:<Dashboard/>}
]
)

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" render={()=> <Registration />}/>
          <Route path="/user-dashboard" element={<Dashboard />}></Route>
          <Route path="/user-dashboard/*" element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter> */}
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
