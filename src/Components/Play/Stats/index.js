import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoldenStar, GrayStar } from "../../utils";
import Autorenew from "@mui/icons-material/Autorenew";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Home from "@mui/icons-material/Home";
import "./Stats.scss";

const Stats = ({ stars, haveWin, replayGame }) => {
    const navigate = useNavigate();
    const { level } = useParams();

    const renderStar = (indexStar, qtdStars) => qtdStars >= indexStar ? <GoldenStar key={indexStar} /> : <GrayStar key={indexStar} />;

    const title = haveWin ? "Você Ganhou!!! :)" : "Você perdeu! :(";
    const levelNum = parseInt(level, 10);

    return (
        <div className="stats">
            <h2>{title}</h2>
            {haveWin && (
                <div className="stars">
                    {[1, 2, 3].map(i => renderStar(i, stars))}
                </div>
            )}
            <span className="btn buttonAgain" onClick={() => replayGame()}>
                <Autorenew />
                Novamente
            </span>
            {haveWin && (
                <span className="btn buttonProximo" onClick={() => replayGame(() => navigate(`/Play/${levelNum + 1}`))}>
                    <PlayArrow />
                    Próximo
                </span>
            )}
            <span className="btn buttonHome" onClick={() => navigate("/")}>
                <Home />
                Fases
            </span>
        </div>
    );
};

export default Stats;
