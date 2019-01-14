import React, { Component } from "react";
import { GoldenStar, DarkStar, Star } from "../utils";
import { withRouter } from "react-router-dom";
import * as Levels from "../../Model/Levels";
import "./index.scss";

class Fases extends Component {
    renderStar = (fase, indexStar, active) => 
        active ? 
            this.getConquer(fase) && this.getConquer(fase).stars >= indexStar
                ? <GoldenStar key={indexStar} />
                : <DarkStar key={indexStar} />
            : <Star key={indexStar} color="#555" />;

    getConquer = ({level}) => Levels.getConquers().find(a => a.level === level && a.difficulty === Levels.getDificulty());

    renderFase = fase => {
        const levelActive = Math.max(...Levels.getConquers().filter(a => a.difficulty === Levels.getDificulty()).map(a => a.level)) + 1 >= fase.level || fase.level === 0
        const classLevel = `fase ${levelActive ? "" : "desativado"}`;
        const handleClick = levelActive ? () => this.props.history.push(`/Play/${fase.level}`) : () => {};

        return (
            <div key={fase.level} className={classLevel} onClick={handleClick.bind(this, fase)}>
                <div className="stars">
                    {[1,2,3].map(i => this.renderStar(fase, i, levelActive))}
                </div>
                <span>{fase.level + 1}</span>
            </div>
        )
    }

    changeDificulty = () => {
        Levels.setDificulty((Levels.getDificulty() + 1) % 3);
        this.setState({});
    }

    render = () => {
        const fases = Array.from({ length: Levels.optValues.length * 4}, (n, i) => ({
            level: i
        }));

        const qtdPontos = Levels.getConquers().map(a => a.stars).reduce((a, b) => a + b, 0);
        const { difficulties } = Levels;
        const labelDificuldade = [
            { diff: difficulties.easy, label: "Fácil" },
            { diff: difficulties.medium, label: "Médio" },
            { diff: difficulties.hard, label: "Dificil" }]
            .find(a => a.diff === Levels.getDificulty()).label || "";

        return (
            <div className="fases">
                <div className="appBar">
                    <div className="pontos">
                        <GoldenStar />
                        <span>{qtdPontos}</span>
                    </div>
                    <h2>JogoMática</h2>
                    <span className="grauDificuldade" onClick={this.changeDificulty}>{labelDificuldade}</span>
                </div>
                {fases.map(this.renderFase)}
            </div>
        )
    };
}

export default withRouter(Fases);