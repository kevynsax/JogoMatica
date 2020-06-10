import React, { Component } from "react";
import { GoldenStar, GrayStar } from "../../utils";
import { withRouter } from "react-router-dom";
import Autorenew from "@material-ui/icons/Autorenew";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Home from "@material-ui/icons/Home";
import "./Stats.scss";

class Stats extends Component{
    renderStar = (indexStar, qtdStars) => qtdStars >= indexStar ? <GoldenStar key={indexStar} /> : <GrayStar key={indexStar} />;

    render = () => {
        const {stars, haveWin, replayGame, history} = this.props;
        const level = parseInt(this.props.match.params.level, 10);
        
        const title = haveWin ? "Você Ganhou!!! :)" : "Você perdeu! :(";

        return (
            <div className="stats">
                <h2>{title}</h2>
                {haveWin && (
                    <div className="stars">
                        {[1, 2, 3].map(i => this.renderStar(i, stars))}
                    </div>
                )}
                <span className="btn buttonAgain" onClick={() => replayGame()}>
                    <Autorenew />
                    Novamente
                </span>
                {haveWin && (
                    <span className="btn buttonProximo" onClick={() => replayGame(() => history.push(`/Play/${level+1}`))}>
                        <PlayArrow />
                        Próximo
                    </span>
                )}
                <span className="btn buttonHome" onClick={() => history.push("/")}>
                    <Home />
                    Fases
                </span>
            </div>
        )
    }
}

export default withRouter(Stats);