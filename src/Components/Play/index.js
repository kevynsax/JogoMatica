import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import GamePlay from "./GamePlay";
import Stats from "./Stats";

class Play extends Component {
    state = {
        playing: true,
        haveWin: false,
        stars: 0
    };

    finishesTheGame = (haveWin, stars) => this.setState({playing: false, haveWin, stars});
    replayGame = callback => {
        if (!!callback)
            callback();
        this.setState({playing: true});
    };

    render = () =>
        this.state.playing
            ? <GamePlay finishesTheGame={this.finishesTheGame}/>
            : <Stats haveWin={this.state.haveWin} stars={this.state.stars} replayGame={this.replayGame}/>;
}

export default withRouter(Play);