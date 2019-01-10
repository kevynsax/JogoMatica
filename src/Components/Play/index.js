import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import GamePlay from "./GamePlay";
import Stats from "./Stats";

class Play extends Component{
    state = {
        playing: true
    }

    finishesTheGame = (callback = () => {}) => this.setState({playing: false}, callback)

    render = () => this.state.playing ? <GamePlay finishesTheGame={this.finishesTheGame}/> : <Stats  />;
}

export default withRouter(Play);