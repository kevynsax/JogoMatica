import React, { Component, Fragment } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Fases from "./Components/Fases";
import Play from "./Components/Play";

class App extends Component {
  render = () => (
    <Router>
      <Fragment>
      <Route exact path="" component={Fases}></Route>
      <Route path="/Play" component={Play}></Route>
      </Fragment>
    </Router>
  )
}

export default App;
