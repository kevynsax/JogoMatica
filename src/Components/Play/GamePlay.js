import React, { Component } from "react";

export default class GamePlay extends Component{
    render = () => <h3 onClick={() => this.props.finishesTheGame()}>Sou o Game Play</h3>
}