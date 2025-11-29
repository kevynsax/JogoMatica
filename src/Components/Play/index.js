import React, {useState} from "react";
import GamePlay from "./GamePlay";
import Stats from "./Stats";

const Play = () => {
    const [playing, setPlaying] = useState(true);
    const [haveWin, setHaveWin] = useState(false);
    const [stars, setStars] = useState(0);

    const finishesTheGame = (win, starCount) => {
        setPlaying(false);
        setHaveWin(win);
        setStars(starCount);
    };

    const replayGame = callback => {
        if (callback) callback();
        setPlaying(true);
    };

    return playing
        ? <GamePlay finishesTheGame={finishesTheGame}/>
        : <Stats haveWin={haveWin} stars={stars} replayGame={replayGame}/>;
};

export default Play;
