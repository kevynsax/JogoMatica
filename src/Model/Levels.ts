
export enum op { soma, subtracao, multiplicacao, divisao };
export enum dificuldades { easy, medium, hard };

export type question = {
    firstValue: number;
    secondValue: number;
    operation: op;
    answer: number;
    score: number;
}

export type fase = {
    nivel: number,
    dif: dificuldades,
    complete: boolean,
    stars: number
}

export interface Jogos{
    questoes: question[];
    nivel: number;
    gerarPergunta: () => void;
    getQuestion: () => question;
    questionAnteriorIgual: () => boolean;
}

export const qtdPerguntasPorNivel = 10;
export const qtdTentativas = 9999;
export const qtdErrosAceitaveis = 2;


const forSub = (q: question) => {
    if(q.firstValue > q.secondValue || q.operation !== op.subtracao) return;
    const c = q.firstValue;
    q.firstValue = q.secondValue;
    q.secondValue = c;
} 

const nivel1Valores = (): question => {
    const gerarValores = (): question => ({
        firstValue: randomNum(1, 10),
        secondValue: randomNum(1, 10)
    } as question)
    let q = gerarValores();
    let count = 0;
    while(q.secondValue+q.firstValue > 9 && count < qtdTentativas){
        gerarValores();
        count++;
    }
    return q;
}

const nivel2Valores = (): question => ({
    firstValue: randomNum(1, 10),
    secondValue: randomNum(1, 10)
} as question);

const nivel3Valores = (): question => ({
    firstValue: randomNum(10, 20),
    secondValue: randomNum(5, 10)
} as question);

const nivel4Valores = (): question => ({
    firstValue: randomNum(10, 20),
    secondValue: randomNum(10, 20)
} as question);

const nivel5Valores = (): question => ({
    firstValue: randomNum(15, 20),
    secondValue: randomNum(15, 20)
} as question);

const nivel6Valores = (): question => ({
    firstValue: randomNum(15, 25),
    secondValue: randomNum(15, 25)
} as question);

const nivel7Valores = (): question => ({
    firstValue: randomNum(11, 50),
    secondValue: randomNum(11, 50)
} as question)

const nivel8Valores = (): question => ({
    firstValue: randomNum(11, 99),
    secondValue: randomNum(11, 99)
} as question);

const nivel9Valores = (): question => ({
    firstValue: randomNum(11, 150),
    secondValue: randomNum(11, 50)
} as question);

const nivel10Valores = (): question => ({
    firstValue: randomNum(11, 150),
    secondValue: randomNum(11, 99)
} as question)

const nivel11Valores = (): question => ({
    firstValue: randomNum(100, 300),
    secondValue: randomNum(100, 300)
} as question)

export const optValores = [ 
    nivel1Valores, 
    nivel2Valores,
    nivel3Valores,
    nivel4Valores,
    nivel5Valores,
    nivel6Valores,
    nivel7Valores,
    nivel8Valores,
    nivel9Valores,
    nivel10Valores,
    nivel11Valores,
];

const valoresFactory = (nivel: number): question => optValores[nivel]();

const nivelFactory = (jogo: Jogos): () => void => {
    if(jogo.nivel >= optValores.length * 3) return () => {};
    return () => {
        const q = jogo.getQuestion();
        const values = valoresFactory(jogo.nivel % optValores.length);
        q.firstValue = values.firstValue;
        q.secondValue = values.secondValue;
        q.operation = Math.floor(jogo.nivel / optValores.length);
        forSub(q);
    }
}
const randomNum = (max: number, min: number) => Math.round(Math.random() * (max - min) + min);


export const getConquers = (): fase[] => JSON.parse(localStorage["conquers"] || "[]");
export const setConquers = (lst: fase[]) => localStorage.setItem("conquers", JSON.stringify(lst));

export const getDificulty = (): dificuldades => JSON.parse(localStorage["dificulty"] || JSON.stringify(dificuldades.easy));
export const setDificulty = (obj: dificuldades) => localStorage.setItem("dificulty", JSON.stringify(obj));