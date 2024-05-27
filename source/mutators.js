// import { geometric_dist, gauss_dist } from '../../genesjs/utils.js';
import { geometric_dist, gauss_dist } from './utils.js';

/**
* Muta el individuo proporcionado in-situ, intercambiando de posición dos
* elementos de sus genomas cada vez. La cantidad de parejas intercambiadas
* estará en función de la probabilidad *mp*.
*
* Establece en *null* el fitness del individuo mutado.
*
* @param {object} task - Una referencia a la tarea asociada al elemento (no usada).
* @param {object} individual - Un individuo.
* @param {object} args - Un arreglo con los parámetros propios de este método. *mp*
* como un número entre 0.0 y 1.0, que representa la probabilidad de que un
* elemento de *genome* sea escogido para ser intercambiado por otro.
**/
export function mutate_swap(task, individual, args) {
    let changed = false;

    const mp = args.mp;
    const gen = individual.get_raw_genome();
    const max_i = gen.length - 1;

    let j = geometric_dist(mp) - 1; // Primer j (y nodo a intercambiar)
    let k;
    let tmp;
    while (j <= max_i) {
        // Elegimos al azar el nodo k
        k = Math.floor(Math.random() * (max_i + 1));

        // Intercambiamos j y k
        tmp = gen[j];
        gen[j] = gen[k];
        gen[k] = tmp;
        j += geometric_dist(mp);

        changed = true;
    }

    if (changed) {
        individual.set_genome_from_raw(gen);
        individual.set_fitness(null);
    }
}

/**
* Muta el individuo proporcionado in-situ, intercambiando el valor de
* una posición del genoma de 0 a 1, o visceversa (sólo para genomas binarios).
* La elección del bit a cambiar se hace con probabilidad *mp*.
*
* Establece en *null* el fitness del individuo mutado.
*
* @param {object} task - Una referencia a la tarea asociada al elemento (no usada).
* @param {object} individual - Un individuo.
* @param {object} args - Un arreglo con los parámetros propios de este método. *mp*
* como un número entre 0.0 y 1.0, que representa la probabilidad de que un
* elemento de *genome* sea escogido para ser alterado.
**/
export function mutate_flip(task, individual, args) {
    let changed = false;

    const mp = args.mp;
    const gen = individual.get_raw_genome();
    const max_i = gen.length - 1;

    let j = geometric_dist(mp) - 1; // Primer j (y nodo a alterar)
    while (j <= max_i) {
        if (gen[j] === '0') {
            gen[j] = '1';
        } else {
            gen[j] = '0';
        }
        j += geometric_dist(mp);

        changed = true;
    }

    if (changed) {
        individual.set_genome_from_raw(gen);
        individual.set_fitness(null);
    }
}

/**
* Muta el individuo proporcionado in situ. Divide el genoma en tres
* subarreglos A, B, C. El operador hace al genoma A, C, B.
*
* Establece en *null* el fitness del individuo mutado.
*
* @param {object} task - Una referencia a la tarea asociada al elemento (no usada).
* @param {object} individual - Un individuo.
* @param {object} args Un arreglo con los parámetros propios de este método
* (no usados).
**/
export function mutate_insert(task, individual, args) {
    let changed = true;

    var gen = individual.get_raw_genome();
    const max_i = gen.length - 1;
    var a = Math.floor(Math.random() * (max_i + 1));
    var b = Math.floor(Math.random() * (max_i + 1));
    var tmp;

    if (b < a) {
        tmp = a;
        a = b;
        b = tmp;
    } else if (b === a) {
        changed = false;
    }

    const slice_a = gen.slice(0, a);
    const slice_b = gen.slice(a, b);
    const slice_c = gen.slice(b);

    gen = slice_a.concat(slice_c, slice_b);

    if (changed) {
        individual.set_genome_from_raw(gen);
        individual.set_fitness(null);
    }
}

/**
* Muta el individuo proporcionado in situ, elige al azar un operador de
* mutación de los especificados en la inicialización. Los parámetros para
* cada operador de mutación se especificaron en la inicialización.
*
* @param {object} task - Una referencia a la tarea asociada al elemento.
* @param {object} individual - Un individuo.
* @param {object} args - Un arreglo con los parámetros propios de este método.
* La llave *operators* será un arreglo con las funciones de mutación. El resto
* de llaves se corresponderán con los parámetros dados a las funciones de
* mutación.
*
* Si más de un operador de mutación utilizan un argumento con el mismo
* nombre, será compartido entre ellos.
**/
export function mutate_multiple(task, individual, args) {
    const max_operators_index = args.operators.length - 1;
    const operator_index = Math.floor(Math.random() * (max_operators_index + 1));

    args.operators[operator_index](task, individual, args);
}

/**
* Muta el individuo proporcionado in situ, alterando de forma normal los valores
* de los genes elegidos al azar en el genoma.
*
* Establece en null el fitness del individuo mutado.
*
* @param {object} task - Una referencia a la tarea asociada al elemento (no usada).
* @param {object} individual - Un individuo.
* @param {object} args - Un arreglo con los parámetros propios de este método.
* *mp* como la probabilidad de que un gen sea mutado, *sd* como la desviación
* estándar aplicada a la mutación, *integer*, si se desea que los valores
* que se establezcan en el genoma sean enteros.
**/
export function mutate_normal(task, individual, args) {
    let changed = false;

    const mp = args.mp;
    const sd = args.sd;
    const integer = args.integer;
    const gen = individual.get_raw_genome();
    const max_i = gen.length - 1;

    let j = geometric_dist(mp) - 1;  // Primer j (y nodo a intercambiar)
    while (j <= max_i) {
        const mean = gen[j];
        gen[j] = gauss_dist(mean, sd, integer);

        j += geometric_dist(mp);

        changed = true;
    }

    if (changed) {
        individual.set_genome_from_raw(gen);
        individual.set_fitness(null);
    }
}
