import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";

const AppRouter = () => {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Home}/>
          <Route path="/register" compponent={Registration}/>
          <Route path="/user-dashboard" component={Dashboard}></Route>
          <Route path="/user-dashboard/*" component={Dashboard}></Route>
        </Switch>
      </Router>
    );
  };
export default AppRouter;