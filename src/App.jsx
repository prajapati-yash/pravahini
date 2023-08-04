// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
// 

import AppRouter from './router';
import './App.css';


// const router = createBrowserRouter([
//   {path:"/", element:<Home/>},{path:"register", element:<Registration/>},{path:"user-dashboard", element:<Dashboard/>}
// ]
// )

function App() {
  return (
    <div className="app-container">
      <AppRouter />
    </div>
  );
}

export default App;
