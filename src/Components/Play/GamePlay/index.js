import React, { Component } from "react";
import { GoldenStar, GrayStar } from "../../utils";
import * as Levels from "../../../Model/Levels";
import { Home, Lens, PanoramaFishEye } from "@material-ui/icons/";
import "./GamePlay.scss";
import { withRouter } from "react-router-dom";

class GamePlay extends Component {
    constructor(props) {
        super(props);

        const { qtdPerguntasPorNivel, gerarPergunta } = Levels;
        const level = parseInt(props.match.params.level, 10)
        const questions = Array.from({ length: qtdPerguntasPorNivel }, (a, i) => gerarPergunta(level));

        this.state = {
            questions,
            openedQuestion: questions[0],
            isStarted: false,
            timeHasStarted: new Date(),
            level
        }
    }

    renderStar = indexStar => <GoldenStar key={indexStar} />;

    renderFeedBack = (question, i) => {
        const Comp = !!question.answer ? Lens : PanoramaFishEye;
        const style = !!question.answer ? this.rightAnswer(question) === question.answer ? "green" : "red" : "";
        return <Comp key={i} className={style} />
    }

    rightAnswer = ({ firstValue, secondValue, operation } = this.state.openedQuestion) => {
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
            <div class="timeBar" style={styleBorder}>
                <div class="filled" ng-style="ctrl.styleTime()">&nbsp;</div>
            </div>
        )
    }

    renderOperation = () => {
        const { openedQuestion } = this.state;
        const { firstValue, secondValue, operation } = openedQuestion;
        const labelOperation = [
            {op: Levels.op.soma, label: "+"},
            {op: Levels.op.subtracao, label: "-"},
            {op: Levels.op.multiplicacao, label: "x"},
            {op: Levels.op.divisao, label: "/"}
        ].find(a => a.op === operation).label;

        return (
            <div className="conta">
                <span>{firstValue}</span>
                <span>{labelOperation}</span>
                <span>{secondValue}</span>
            </div>
        )
    }

    render = () => {
        const goHome = () => this.props.history.push("/");
        const {level} = this.state;

        return (
            <div className="play" ng-if="ctrl.showPlay()">
                <div className="statusBar">
                    <Home className="link" onClick={goHome}></Home>
                    <div className="stars">
                        {[1, 2, 3].map(this.renderStar)}
                    </div>
                    <span>{level + 1}</span>
                </div>
                <div className="game">
                    <div className="feedback">
                        {this.state.questions.map(this.renderFeedBack)}
                    </div>
                    {this.state.isStarted && this.renderTimeBar()}
                    <div className="operacao">
                        {this.renderOperation()}
                        <input type="number" ng-change="ctrl.handleChangeInput()" ng-model="ctrl.valueResp" />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(GamePlay);