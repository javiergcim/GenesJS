import { Individual } from '../../genesjs/individual.js';
import { BinaryInd } from '../../genesjs/binaryind.js';
import { fisher_yates } from '../../genesjs/utils.js';

/**
* Crea una población de tamaño *$n* de individuos con un genoma que almacena
* permutaciones. Los elementos a permutar se establecen en *elements*.
*
* @param {number} n - Cantidad de individuos a crear.
* @param {array} elements - Un arreglo con los elementos a permutar.
*
* @return {array} La población.
**/
export function init_permutation_pop(n, elements) {
    // Se forzan al menos dos individuos
    if (n < 2) {
        n = 2;
    }

    const new_pop = [];
    for (let i = 0; i < n; i++) {
        const genome = [...elements];
        fisher_yates(genome);
        new_pop.push(new Individual(genome));
    }

    return new_pop;
}

/**
* Crea una población de tamaño *$n* de individuos con un genoma que almacena
* números flotantes.
*
* @param {number} n - Cantidad de individuos a crear.
* @param {number} numbers - Cantidad de números almacenados en un genoma.
* @param {number} min - Valor mínimo del rango del cual se tomarán los números.
* @param {number} max - Valor máximo del rango del cual se tomarán los números.
*
* @return {array} La población.
**/
export function init_float_pop(n, numbers, min, max) {
    // Se forzan al menos dos individuos
    if (n < 2) {
        n = 2;
    }

    const new_pop = [];
    for (let i = 0; i < n; i++) {
        const genome = [];
        for (let j = 0; j < numbers; j++) {
            const range = max - min;
            genome.push((Math.random() * range) + min);
        }
        new_pop.push(new Individual(genome));
    }

    return new_pop;
}

/**
* Crea una población de tamaño *n* de individuos con un genoma que
* almacena variables codificadas en binario.
*
* @param {number} n - Cantidad de individuos a crear.
* @param {array} structure - Un arreglo que especifica cómo se codificarán las
* variables en el genoma. Para cada variavle hay un elemento. A su
* vez, cada elemento posee otros tres, que indicarán, en este
* orden: bit de signo, bits de parte entera, bits de mantisa.
*
* *Ejemplo*
*
* Dos varables, la primera con bit de signo, diez bits para almacenar la
* parte entera, y cinco para la parte decimal. La segunda variable no
* posee signo, trece bits para la parte entera y cero para la mantisa.
*
* [[true, 10, 5], [false, 13, 0]]
*
* @return {array} La población.
**/
export function init_binary_pop(n, structure) {
    // Se forzan al menos dos individuos
    if (n < 2) {
        n = 2;
    }

    // Se calculan atributos de aceleración de cálculo con base en estructura
    let total_bits = 0;
    let var_bits = [];
    let sign_bits = [];
    let precalc = [];
    const n_vars = structure.length;
    for (const i of structure) {
        const current_bits = i.reduce((acc, val) => acc + val, 0);
        total_bits += current_bits;
        var_bits.push(current_bits);
        sign_bits.push(i[0]);
        precalc.push(1.0 / Math.pow(2, i[2]));
    }

    // Se crean los individuos
    const vault = ['0', '1'];
    const new_pop = [];
    for (let i = 0; i < n; i++) {
        const genome = [];
        for (let j = 0; j < total_bits; j++) {
            genome.push(vault[Math.floor(Math.random() * 2)]);
        }

        new_pop.push(new BinaryInd(genome, var_bits, sign_bits, precalc, structure));
    }

    return new_pop;
}
