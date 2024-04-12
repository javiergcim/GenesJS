/** Un script de ejemplo
**/

import { Task } from '../../genesjs/task.js';
import { init_binary_pop } from '../../genesjs/initiators.js';
import { cos_mutation_ga } from '../../genesjs/algorithms.js';
import { mutate_flip } from '../../genesjs/mutators.js';
import { crossover_one_point } from '../../genesjs/crossovers.js';
import { select_vasconcelos } from '../../genesjs/selectors.js';

/**
* Función de evaluación de ejemplo.
*
* @param {object} task - La tarea asociada al problema.
* @param {object} args - Un arreglo con los argumentos codificados en el genoma.
*
* @returns {number} El fitness asociado a los argumentos proporcionados.
**/
function example_evaluation_function(genome, data) {
    return Math.pow(1.5 - genome[0] + (genome[0] * genome[1]), 2) +
        Math.pow(2.25 - genome[0] + (genome[0] * Math.pow(genome[1], 2)), 2) +
        Math.pow(2.625 - genome[0] + (genome[0] * Math.pow(genome[1], 3)), 2);
}

/**
* Esta función prepara la tarea y ejecuta el algoritmo genético.
**/
function my_example() {
    console.log('Start!');

    // Se crean valores de configuración
    const n = 500;  // Individuos
    const gen = 50;  // Generaciones máximas
    const cp = 0.3;  // Probabilidad de cruza
    const max_mp = 0.05; // Máxima probabilidad de mutación
    const cycle_mp = 100.0; // Generaciónes por ciclo de mutación
    const elitism = 1.0;  // Porcentaje de elitismo
    const duration = Infinity;  // Duración máxima en segundos
    const verbose = 10;  // Frecuencia de reporte

    // Se crea la tarea
    const task = new Task();

    // Se crea y asigna la población inicial
    // Two individuals [sign bit (bool), integer bits (int), matissa bits (int)]
    const struct = [[true, 5, 5],   // x
    [true, 5, 5]];  // y
    const the_pop = init_binary_pop(n, struct);
    task.set_population(the_pop);

    // Se establecen funciones de cruza, mutacion y selección
    task.set_evals([example_evaluation_function], [-1.0]);
    task.set_mutator(mutate_flip, { 'mp': max_mp });
    task.set_crossover(crossover_one_point);
    task.set_selector(select_vasconcelos, { 'cp': cp });

    // Inicia el algoritmo
    const sol = cos_mutation_ga(
        task,
        max_mp,
        cycle_mp,
        elitism,
        duration,
        gen,
        verbose
    );

    console.log(sol.toString());
    console.log('Friendly genome:');
    console.log(sol.get_genome());
}

document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById("trigger");
    button.addEventListener('click', my_example);
});
