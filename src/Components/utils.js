import React from "react";
import MaterialStar from "@material-ui/icons/Star";
import "./utils.scss";

export const GoldenStar = props => (<MaterialStar className="goldenStar" />);
export const GrayStar = props => (<MaterialStar className="grayStar" />);
export const DarkStar = props => (<MaterialStar className="darkStar" />);
export const Star = props => (<MaterialStar style={{color: props.color}} />)