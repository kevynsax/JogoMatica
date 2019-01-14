import React, { Component } from "react";
import { GoldenStar, GrayStar } from "../../utils";
import * as Levels from "../../../Model/Levels";
import { Home, Lens, PanoramaFishEye } from "@material-ui/icons/";
import "./GamePlay.scss";
import { withRouter } from "react-router-dom";
import * as moment from "moment";

class GamePlay extends Component {
    constructor(props) {
        super(props);
        const level = parseInt(props.match.params.level, 10)
        const questions = this.getQuestions(level);

        this.state = {
            questions,
            idActualQuestion: 0,
            isStarted: false,
            timeHasStarted: null,
            level,
            inputValue: ""
        }
    }

    componentWillUnmount = () => clearInterval(this.intervalObject);
    setupTimer = () => this.intervalObject = setInterval(() => this.setState({}), 500);

    getQuestions = level => {
        const { qtyQuestionsForLevel, gerarPergunta, qtyAttempts } = Levels;
        const questions = Array.from({ length: qtyQuestionsForLevel }, (a, i) => gerarPergunta(level));

        let hasDuplicated = false;
        let count = 0;

        do hasDuplicated = this.takeOutSequenceDuplicated(level, questions, gerarPergunta)
        while(hasDuplicated && count++ < qtyAttempts);
        return questions;
    }

    takeOutSequenceDuplicated = (level, questions, gerarPergunta) => {
        let hasDuplicated = false;
        questions.forEach((q, i, arr) => {
            if(i===0) return;
            
            const pq = arr[i-1]; //Previews Question
            if(pq.firstValue !== q.firstValue || pq.secondValue !== q.firstValue) return;
            
            hasDuplicated = true;

            const nq = gerarPergunta(level);
            q.firstValue = nq.firstValue;
            q.secondValue = nq.secondValue;
        });
        return hasDuplicated;
    }

    renderStar = indexStar => this.qtdStars() >= indexStar ? <GoldenStar key={indexStar} /> : <GrayStar key={indexStar} />;

    renderFeedBack = (question, i) => {
        const Comp = !!question.answer ? Lens : PanoramaFishEye;
        const style = !!question.answer ? this.rightAnswer(question) === question.answer ? "green" : "red" : "";
        return <Comp key={i} className={style} />
    }

    rightAnswer = ({ firstValue, secondValue, operation } = this.state.questions[this.state.idActualQuestion]) =>[
            { op: Levels.op.soma, answer: firstValue + secondValue },
            { op: Levels.op.subtracao, answer: firstValue - secondValue },
            { op: Levels.op.multiplicacao, answer: firstValue * secondValue },
            { op: Levels.op.divisao, answer: firstValue / secondValue }
        ].find(a => a.op === operation).answer;

    renderTimeBar = () => {
        const { level, timeHasStarted } = this.state;
        const { optValues, qtyQuestionsForLevel } = Levels;
        const difficulty = Levels.getDificulty();

        const qtyTimeHasPassed = moment().diff(timeHasStarted, "seconds");
        const totalTimeLevel = [4, 1, .5][difficulty] * ((level % optValues.length) + 1) * qtyQuestionsForLevel

        const percentageTime = qtyTimeHasPassed * 100 / totalTimeLevel;
        const color = [
            "0909fd", "1800d3", "2b00b7", "43008a", "5f0077",
            "6d0069", "8f004b", "a70037", "cd001d", "ee000d"
        ][Math.floor(percentageTime / 10)];

        const styleFilledTimeBar = {
            "width": `${100 - Math.round(percentageTime)}%`,
            "background": `#${color}`
        }
        return (
            <div className="timeBar">
                <div className="filled" style={styleFilledTimeBar}>&nbsp;</div>
            </div>
        )
    }

    handleChangeInput = event => {
        const { isStarted, questions } = this.state;
        let { idActualQuestion } = this.state;

        if(!isStarted)
            this.setState({ isStarted: true, timeHasStarted: new Date() }, this.setupTimer);

        const value = parseInt(event.target.value, 10);
        const rightAnswer = this.rightAnswer();

        if(value.toString().length !== rightAnswer.toString().length){
            this.setState({inputValue: value.toString()});
            return;
        }

        const question = questions[idActualQuestion];
        question.answer = value;

        ++idActualQuestion;

        const qtyErrors = this.state.questions.filter(a => !!a.answer && a.answer !== this.rightAnswer(a)).length
        if(idActualQuestion === Levels.qtyQuestionsForLevel || qtyErrors > Levels.qtyAceptableErrors){
            this.endGame();
            return;
        }

        this.setState({ inputValue: "", idActualQuestion})
    }

    qtdStars = () => {
        const { qtyAceptableErrors, qtyQuestionsForLevel } = Levels;

        const qtyWouldFail = qtyQuestionsForLevel - qtyAceptableErrors - 1;
        let stars = this.qtySuccess() - qtyWouldFail;
        stars = stars > 3 ? 3 : stars;
        return stars;
    }

    qtySuccess = () => this.state.questions.filter(a => a.answer === this.rightAnswer(a)).length;

    endGame = () => {
        const { qtyAceptableErrors, qtyQuestionsForLevel, getConquers, setConquers, getDificulty } = Levels;
        const { finishesTheGame } = this.props;

        const qtySuccess = this.qtySuccess();
        const haveWin = qtySuccess >= (qtyQuestionsForLevel - qtyAceptableErrors);

        if(!haveWin){
            finishesTheGame(false, 0);
            return;
        }

        const stars = this.qtdStars();
        const { level } = this.state;
        const difficulty = getDificulty();
    
        const filterConquer = a => a.level === level && a.difficulty === difficulty;
        let conquers = getConquers();
        let conquer = conquers.find(filterConquer) || ({ level, stars, difficulty })

        conquer.stars = conquer.stars > stars ? conquer.stars : stars;

        conquers = [conquer, ...conquers.filter(a => !filterConquer(a))];
        setConquers(conquers);

        finishesTheGame(true, stars);
    }   
    
    renderOperation = () => {
        const { questions, idActualQuestion } = this.state;
        const { firstValue, secondValue, operation } = questions[idActualQuestion];
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
        const { level, inputValue } = this.state;

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
                        <input type="number" onChange={this.handleChangeInput} value={inputValue} />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(GamePlay);