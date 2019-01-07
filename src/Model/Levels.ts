
export enum op { soma, subtracao, multiplicacao, divisao };
export enum dificuldades { easy, medium, hard };

export type questao = {
    valor1: number;
    valor2: number;
    operador: op;
    resposta: number;
    pontos: number;
}

export type fase = {
    nivel: number,
    dif: dificuldades,
    complete: boolean,
    stars: number
}

export interface Jogos{
    questoes: questao[];
    nivel: number;
    gerarPergunta: () => void;
    getQuestion: () => questao;
    questaoAnteriorIgual: () => boolean;
}

const qtdPerguntasPorNivel = 10;
const qtdTentativas = 9999;
const qtdErrosAceitaveis = 2;


const forSub = (q: questao) => {
    if(q.valor1 > q.valor2 || q.operador !== op.subtracao) return;
    const c = q.valor1;
    q.valor1 = q.valor2;
    q.valor2 = c;
} 

const nivel1Valores = (): questao => {
    const gerarValores = (): questao => ({
        valor1: randomNum(1, 10),
        valor2: randomNum(1, 10)
    } as questao)
    let q = gerarValores();
    let count = 0;
    while(q.valor2+q.valor1 > 9 && count < qtdTentativas){
        gerarValores();
        count++;
    }
    return q;
}

const nivel2Valores = (): questao => ({
    valor1: randomNum(1, 10),
    valor2: randomNum(1, 10)
} as questao);

const nivel3Valores = (): questao => ({
    valor1: randomNum(10, 20),
    valor2: randomNum(5, 10)
} as questao);

const nivel4Valores = (): questao => ({
    valor1: randomNum(10, 20),
    valor2: randomNum(10, 20)
} as questao);

const nivel5Valores = (): questao => ({
    valor1: randomNum(15, 20),
    valor2: randomNum(15, 20)
} as questao);

const nivel6Valores = (): questao => ({
    valor1: randomNum(15, 25),
    valor2: randomNum(15, 25)
} as questao);

const nivel7Valores = (): questao => ({
    valor1: randomNum(11, 50),
    valor2: randomNum(11, 50)
} as questao)

const nivel8Valores = (): questao => ({
    valor1: randomNum(11, 99),
    valor2: randomNum(11, 99)
} as questao);

const nivel9Valores = (): questao => ({
    valor1: randomNum(11, 150),
    valor2: randomNum(11, 50)
} as questao);

const nivel10Valores = (): questao => ({
    valor1: randomNum(11, 150),
    valor2: randomNum(11, 99)
} as questao)

const nivel11Valores = (): questao => ({
    valor1: randomNum(100, 300),
    valor2: randomNum(100, 300)
} as questao)

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

const valoresFactory = (nivel: number): questao => optValores[nivel]();

const nivelFactory = (jogo: Jogos): () => void => {
    if(jogo.nivel >= optValores.length * 3) return () => {};
    return () => {
        const q = jogo.getQuestion();
        const values = valoresFactory(jogo.nivel % optValores.length);
        q.valor1 = values.valor1;
        q.valor2 = values.valor2;
        q.operador = Math.floor(jogo.nivel / optValores.length);
        forSub(q);
    }
}
const randomNum = (max: number, min: number) => Math.round(Math.random() * (max - min) + min);
