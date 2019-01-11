import React, { Component } from "react";
import { GoldenStar, GrayStar } from "../../utils";
import * as Levels from "../../../Model/Levels";
import { Home, Lens, PanoramaFishEye } from "@material-ui/icons/";
import "./GamePlay.scss";
import { withRouter } from "react-router-dom";
import Moment, {MomentProps} from "react-moment";

class GamePlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: Array.from({ length: Levels.qtdPerguntasPorNivel }, (a, i) => ({})),
            isStarted: false,
            timeHasStarted: new Date()
        }
    }

    renderStar = indexStar => <GoldenStar key={indexStar} />;

    renderQuestion = (question, i) => {
        const Comp = !!question.answer ? Lens : PanoramaFishEye;
        const style = !!question.answer ? this.rightAnswer(question) === question.answer ? "green" : "red" : "";
        return <Comp key={i} className={style} />
    }

    rightAnswer = ({ firstValue, secondValue, operation }) => {
        const opt = [
            { op: Levels.op.soma, answer: firstValue + secondValue },
            { op: Levels.op.subtracao, answer: firstValue - secondValue },
            { op: Levels.op.multiplicacao, answer: firstValue * secondValue },
            { op: Levels.op.divisao, answer: firstValue / secondValue }
        ].find(a => a.op === operation);

        return (opt && opt.answer) || 0;
    }

    renderTimeBar = () => {
        const color = [
            "0909fd", "1800d3", "2b00b7", "43008a", "5f0077", 
            "6d0069", "8f004b", "a70037", "cd001d", "ee000d"
        ][Math.floor(this.percentageTime() / 10)];

        const styleBorder = { border: `2px solid #${color}` };
        const styleFilledTimeBar = {
            "width": `${100 - Math.round(this.percentageTime())}%`,
            "background": `#${color}`
        }
        return (
            <Moment interval={100}>
                <div class="timeBar" style={styleBorder}>
                    <div class="filled" ng-style="ctrl.styleTime()">&nbsp;</div>
                </div>
            </Moment>
        )
    }

    render = () => {
        const goHome = () => this.props.history.push("/");
        const level = parseInt(this.props.match.params.level, 10);
        return (
            <div class="play" ng-if="ctrl.showPlay()">
                <div class="statusBar">
                    <Home className="link" onClick={goHome}></Home>
                    <div class="stars">
                        {[1, 2, 3].map(this.renderStar)}
                    </div>
                    <span>{level + 1}</span>
                </div>
                <div class="game">
                    <div class="feedback">
                        {this.state.questions.map(this.renderQuestion)}
                    </div>
                    {this.state.isStarted && this.renderTimeBar()}
                    <div class="operacao">
                        <div class="conta">
                            <span ng-bind="ctrl.getQuestion().firstValue"></span>
                            <span ng-bind="ctrl.labeloperation()"></span>
                            <span ng-bind="ctrl.getQuestion().secondValue"></span>
                        </div>
                        <input type="number" ng-change="ctrl.handleChangeInput()" ng-model="ctrl.valueResp" />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(GamePlay);