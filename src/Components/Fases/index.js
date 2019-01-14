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

    getConquer = ({nivel}) => Levels.getConquers().find(a => a.nivel === nivel && a.dif === Levels.getDificulty());

    renderFase = fase => {
        const levelActive = Math.max(...Levels.getConquers().filter(a => a.dif === Levels.getDificulty()).map(a => a.nivel)) + 1 >= fase.nivel || fase.nivel === 0
        const classLevel = `fase ${levelActive ? "" : "desativado"}`;
        const handleClick = levelActive ? () => this.props.history.push(`/Play/${fase.nivel}`) : () => {};

        return (
            <div key={fase.nivel} className={classLevel} onClick={handleClick.bind(this, fase)}>
                <div className="stars">
                    {[1,2,3].map(i => this.renderStar(fase, i, levelActive))}
                </div>
                <span>{fase.nivel + 1}</span>
            </div>
        )
    }

    changeDificulty = () => {
        Levels.setDificulty((Levels.getDificulty() + 1) % 3);
        this.setState({});
    }

    render = () => {
        const fases = Array.from({ length: Levels.optValores.length * 4}, (n, i) => ({
            nivel: i
        }));

        const qtdPontos = Levels.getConquers().map(a => a.stars).reduce((a, b) => a + b, 0);

        const labelDificuldade = [
            { diff: Levels.dificuldades.easy, label: "Fácil" },
            { diff: Levels.dificuldades.medium, label: "Médio" },
            { diff: Levels.dificuldades.hard, label: "Dificil" }]
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