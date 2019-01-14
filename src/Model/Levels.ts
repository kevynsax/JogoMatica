
export enum op { soma, subtracao, multiplicacao, divisao };
export enum difficulties { easy, medium, hard };

export type question = {
    firstValue: number;
    secondValue: number;
    operation: op;
    answer: number;
}

export type fase = {
    level: number,
    difficulty: difficulties,
    stars: number
}

export const qtyQuestionsForLevel = 10;
export const qtyAttempts = 9999;
export const qtyAceptableErrors = 2;

const forSub = (q: question) => {
    if(q.firstValue > q.secondValue || q.operation !== op.subtracao) return;
    const c = q.firstValue;
    q.firstValue = q.secondValue;
    q.secondValue = c;
} 

const valuesLevel1 = (): question => {
    const generateValues = (): question => ({
        firstValue: randomNum(1, 10),
        secondValue: randomNum(1, 10)
    } as question)
    let q = generateValues();
    let count = 0;
    while(q.secondValue+q.firstValue > 9 && count++ < qtyAttempts) generateValues();
    return q;
}

const valuesLevel2 = (): question => ({
    firstValue: randomNum(1, 10),
    secondValue: randomNum(1, 10)
} as question);

const valuesLevel3 = (): question => ({
    firstValue: randomNum(10, 20),
    secondValue: randomNum(5, 10)
} as question);

const valuesLevel4 = (): question => ({
    firstValue: randomNum(10, 20),
    secondValue: randomNum(10, 20)
} as question);

const valuesLevel5 = (): question => ({
    firstValue: randomNum(15, 20),
    secondValue: randomNum(15, 20)
} as question);

const valuesLevel6 = (): question => ({
    firstValue: randomNum(15, 25),
    secondValue: randomNum(15, 25)
} as question);

const valuesLevel7 = (): question => ({
    firstValue: randomNum(11, 50),
    secondValue: randomNum(11, 50)
} as question)

const valuesLevel8 = (): question => ({
    firstValue: randomNum(11, 99),
    secondValue: randomNum(11, 99)
} as question);

const valuesLevel9 = (): question => ({
    firstValue: randomNum(11, 150),
    secondValue: randomNum(11, 50)
} as question);

const valuesLevel10 = (): question => ({
    firstValue: randomNum(11, 150),
    secondValue: randomNum(11, 99)
} as question)

const valuesLevel11 = (): question => ({
    firstValue: randomNum(100, 300),
    secondValue: randomNum(100, 300)
} as question)

export const optValues = [ 
    valuesLevel1, 
    valuesLevel2,
    valuesLevel3,
    valuesLevel4,
    valuesLevel5,
    valuesLevel6,
    valuesLevel7,
    valuesLevel8,
    valuesLevel9,
    valuesLevel10,
    valuesLevel11,
];

const valoresFactory = (nivel: number): question => optValues[nivel]();

export const gerarPergunta = (nivel: number): question => {
    const values = valoresFactory(nivel % optValues.length);
    let result = {
        firstValue: values.firstValue,
        secondValue: values.secondValue,
        operation: Math.floor(nivel / optValues.length),
    } as question;
    
    forSub(result);
    return result;
}

const randomNum = (max: number, min: number) => Math.round(Math.random() * (max - min) + min);


export const getConquers = (): fase[] => JSON.parse(localStorage["conquers"] || "[]");
export const setConquers = (lst: fase[]) => localStorage.setItem("conquers", JSON.stringify(lst));

export const getDificulty = (): difficulties => JSON.parse(localStorage["dificulty"] || JSON.stringify(difficulties.easy));
export const setDificulty = (obj: difficulties) => localStorage.setItem("dificulty", JSON.stringify(obj));