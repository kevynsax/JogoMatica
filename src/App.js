import React, { Component, Fragment } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Fases from "./Components/Fases";
import Play from "./Components/Play";

class App extends Component {
  render = () => {
      const isProduction = process.env.NODE_ENV === 'production';
      return (
          <Router basename={isProduction ? '/jogomatica' : ''}>
              <Fragment>
                  <Routes>
                      <Route path="/" element={<Fases />} />
                      <Route path="/Play/:level" element={<Play />} />
                  </Routes>
              </Fragment>
          </Router>
      );
  }
}

export default App;
