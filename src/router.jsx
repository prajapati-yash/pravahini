import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";


const AppRouter = () => {
    return (
      <Routes>
        <Routes>
          <Route path="/" component={Home}/>
          <Route path="/register" compponent={Registration}/>
          <Route path="/user-dashboard" component={Dashboard}/>
          <Route path="/user-dashboard/*" component={Dashboard}/>
        </Routes>
      </Routes>
    );
  };
export default AppRouter;