import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoldenStar, GrayStar } from "../../utils";
import * as Levels from "../../../Model/Levels";
import Home from "@mui/icons-material/Home";
import Lens from "@mui/icons-material/Lens";
import PanoramaFishEye from "@mui/icons-material/PanoramaFishEye";
import "./GamePlay.scss";
import { differenceInSeconds } from "date-fns";

const GamePlay = ({ finishesTheGame }) => {
    const navigate = useNavigate();
    const { level } = useParams();
    const levelNum = parseInt(level, 10);
    const [questions, setQuestions] = useState(() => getQuestions(levelNum));
    const [idActualQuestion, setIdActualQuestion] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [timeHasStarted, setTimeHasStarted] = useState(null);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        let interval;
        if (isStarted) {
            interval = setInterval(() => {
                // Force re-render
                setQuestions([...questions]);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isStarted, questions]);

    function getQuestions(level) {
        const { qtyQuestionsForLevel, gerarPergunta, qtyAttempts } = Levels;
        const questions = Array.from({ length: qtyQuestionsForLevel }, () => gerarPergunta(level));

        let hasDuplicated = false;
        let count = 0;

        do hasDuplicated = takeOutSequenceDuplicated(level, questions, gerarPergunta)
        while(hasDuplicated && count++ < qtyAttempts);
        return questions;
    }

    function takeOutSequenceDuplicated(level, questions, gerarPergunta) {
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

    const renderStar = indexStar => qtdStars() >= indexStar ? <GoldenStar key={indexStar} /> : <GrayStar key={indexStar} />;

    const renderFeedBack = (question, i) => {
        const Comp = !!question.answer ? Lens : PanoramaFishEye;
        const style = !!question.answer ? rightAnswer(question) === question.answer ? "green" : "red" : "";
        return <Comp key={i} className={style} />
    };

    const rightAnswer = (question = questions[idActualQuestion]) => [
        { op: Levels.op.soma, answer: question.firstValue + question.secondValue },
        { op: Levels.op.subtracao, answer: question.firstValue - question.secondValue },
        { op: Levels.op.multiplicacao, answer: question.firstValue * question.secondValue },
        { op: Levels.op.divisao, answer: question.firstValue / question.secondValue }
    ].find(a => a.op === question.operation).answer;

    const renderTimeBar = () => {
        const { optValues, qtyQuestionsForLevel } = Levels;
        const difficulty = Levels.getDificulty();

        const qtyTimeHasPassed = differenceInSeconds(new Date(), timeHasStarted);
        const totalTimeLevel = [4, 1, .5][difficulty] * ((levelNum % optValues.length) + 1) * qtyQuestionsForLevel;
        const percentageTime = qtyTimeHasPassed * 100 / totalTimeLevel;
        const color = [
            "0909fd", "1800d3", "2b00b7", "43008a", "5f0077",
            "6d0069", "8f004b", "a70037", "cd001d", "ee000d"
        ][Math.floor(percentageTime / 10)];

        const styleFilledTimeBar = {
            "width": `${100 - Math.round(percentageTime)}%`,
            "background": `#${color}`
        };
        return (
            <div className="timeBar">
                <div className="filled" style={styleFilledTimeBar}>&nbsp;</div>
            </div>
        )
    };

    const handleChangeInput = event => {
        if(!isStarted) {
            setIsStarted(true);
            setTimeHasStarted(new Date());
        }

        const value = parseInt(event.target.value, 10);
        const rightAnswerVal = rightAnswer();

        if(value.toString().length !== rightAnswerVal.toString().length){
            setInputValue(value.toString());
            return;
        }

        const question = questions[idActualQuestion];
        question.answer = value;

        const newId = idActualQuestion + 1;

        const qtyErrors = questions.filter(a => !!a.answer && a.answer !== rightAnswer(a)).length
        if(newId === Levels.qtyQuestionsForLevel || qtyErrors > Levels.qtyAceptableErrors){
            endGame();
            return;
        }

        setInputValue("");
        setIdActualQuestion(newId);
    };

    const qtdStars = () => {
        const { qtyAceptableErrors, qtyQuestionsForLevel } = Levels;

        const qtyWouldFail = qtyQuestionsForLevel - qtyAceptableErrors - 1;
        let stars = qtySuccess() - qtyWouldFail;
        stars = stars > 3 ? 3 : stars;
        return stars;
    };

    const qtySuccess = () => questions.filter(a => a.answer === rightAnswer(a)).length;

    const endGame = () => {
        const { qtyAceptableErrors, qtyQuestionsForLevel, getConquers, setConquers, getDificulty } = Levels;

        const qtySuccessVal = qtySuccess();
        const haveWin = qtySuccessVal >= (qtyQuestionsForLevel - qtyAceptableErrors);

        if(!haveWin){
            finishesTheGame(false, 0);
            return;
        }

        const stars = qtdStars();
        const difficulty = getDificulty();
    
        const filterConquer = a => a.level === levelNum && a.difficulty === difficulty;
        let conquers = getConquers();
        let conquer = conquers.find(filterConquer) || ({ level: levelNum, stars, difficulty })

        conquer.stars = conquer.stars > stars ? conquer.stars : stars;

        conquers = [conquer, ...conquers.filter(a => !filterConquer(a))];
        setConquers(conquers);

        finishesTheGame(true, stars);
    };
    
    const renderOperation = () => {
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
    };

    const goHome = () => navigate("/");

    return (
        <div className="play">
            <div className="statusBar">
                <Home className="link" onClick={goHome}></Home>
                <div className="stars">
                    {[1, 2, 3].map(renderStar)}
                </div>
                <span>{levelNum + 1}</span>
            </div>
            <div className="game">
                <div className="feedback">
                    {questions.map(renderFeedBack)}
                </div>
                {isStarted && renderTimeBar()}
                <div className="operacao">
                    {renderOperation()}
                    <input type="number" onChange={handleChangeInput} value={inputValue} />
                </div>
            </div>
        </div>
    )
};

export default GamePlay;
