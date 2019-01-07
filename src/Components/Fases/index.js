import React, { Component } from "react";
import { GoldenStar, DarkStar } from "../utils";
import * as Levels from "../../Model/Levels";
import "./index.scss";

export default class Fases extends Component {
    renderStar = (fase, indexStar) => (<DarkStar key={indexStar} />);

    renderFase = fase => {
        return (
            <div key={fase.nivel} className="fase" ng-class="ctrl.classLevel(f)" ng-click="ctrl.setLevel(f)">
                <div className="stars">
                    {[1,2,3].map(i => this.renderStar(fase, i))}
                </div>
                <span>{fase.nivel + 1}</span>
            </div>
        )
    }

    render = () => {
        const fases = Array.from({ length: Levels.optValores.length * 3}, (n, i) => ({
            nivel: i
        }));

        return (
            <div className="fases" ng-if="ctrl.showFases()">
                <div className="appBar">
                    <div className="pontos">
                        <GoldenStar />
                        <span ng-bind="ctrl.qtdPontos()"></span>
                    </div>
                    <h2>JogoMática</h2>
                    <span className="grauDificuldade" ng-bind="ctrl.labelDificuldade()" ng-click="ctrl.changeDificuldade()"></span>
                </div>
                {fases.map(this.renderFase)}
            </div>
        )
    };
}