import React, { Component, Fragment } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Fases from "./Components/Fases";
import Play from "./Components/Play";

class App extends Component {
  render = () => {
      const isProduction = process.env.NODE_ENV === 'production';
      return (
          <Router basename={isProduction ? '/jogo-matica' : ''}>
              <Fragment>
                  <Route exact path="" component={Fases}></Route>
                  <Route path="/Play/:level" component={Play}></Route>
              </Fragment>
          </Router>
      );
  }
}

export default App;
