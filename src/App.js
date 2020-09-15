import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import TopNav from "./top-nav";
import Routes from "./Routes";

const App = () => {
  return (
    <Router>
      <TopNav />
      <Routes />
    </Router>
  );
};

export default App;
