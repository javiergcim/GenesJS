/** Un script de ejemplo
**/

import { Task } from '../../genesjs/task.js';
import { init_permutation_pop } from '../../genesjs/initiators.js';
import { cos_mutation_ga } from '../../genesjs/algorithms.js';
import { mutate_swap } from '../../genesjs/mutators.js';
import { crossover_scx } from '../../genesjs/crossovers.js';
import { select_vasconcelos, select_tournament } from '../../genesjs/selectors.js';
import { create_distance_matrix, travel_cost } from '../../genesjs/utils.js';

/**
* Función de evaluación de ejemplo.
*
* @param {object} task - La tarea asociada al problema.
* @param {object} args - Un arreglo con los argumentos codificados en el genoma.
*
* @returns {number} El fitness asociado a los argumentos proporcionados.
**/
function example_evaluation_function(genome, data) {
    // return Math.pow(genome[0] + genome[1], 2);
    return genome[0] + genome[1];
}

/**
* Esta función prepara la tarea y ejecuta el algoritmo genético.
**/
function my_example() {
    console.log('Start!');

    const locations = [
        { 'id': '1', 'coords': [0, 13] },
        { 'id': '2', 'coords': [0, 26] },
        { 'id': '3', 'coords': [0, 27] },
        { 'id': '4', 'coords': [0, 39] },
        { 'id': '5', 'coords': [2, 0] },
        { 'id': '6', 'coords': [5, 13] },
        { 'id': '7', 'coords': [5, 19] },
        { 'id': '8', 'coords': [5, 25] },
        { 'id': '9', 'coords': [5, 31] },
        { 'id': '10', 'coords': [5, 37] },
        { 'id': '11', 'coords': [5, 43] },
        { 'id': '12', 'coords': [5, 8] },
        { 'id': '13', 'coords': [8, 0] },
        { 'id': '14', 'coords': [9, 10] },
        { 'id': '15', 'coords': [10, 10] },
        { 'id': '16', 'coords': [11, 10] },
        { 'id': '17', 'coords': [12, 10] },
        { 'id': '18', 'coords': [12, 5] },
        { 'id': '19', 'coords': [15, 13] },
        { 'id': '20', 'coords': [15, 19] },
        { 'id': '21', 'coords': [15, 25] },
        { 'id': '22', 'coords': [15, 31] },
        { 'id': '23', 'coords': [15, 37] },
        { 'id': '24', 'coords': [15, 43] },
        { 'id': '25', 'coords': [15, 8] },
        { 'id': '26', 'coords': [18, 11] },
        { 'id': '27', 'coords': [18, 13] },
        { 'id': '28', 'coords': [18, 15] },
        { 'id': '29', 'coords': [18, 17] },
        { 'id': '30', 'coords': [18, 19] },
        { 'id': '31', 'coords': [18, 21] },
        { 'id': '32', 'coords': [18, 23] },
        { 'id': '33', 'coords': [18, 25] },
        { 'id': '34', 'coords': [18, 27] },
        { 'id': '35', 'coords': [18, 29] },
        { 'id': '36', 'coords': [18, 31] },
        { 'id': '37', 'coords': [18, 33] },
        { 'id': '38', 'coords': [18, 35] },
        { 'id': '39', 'coords': [18, 37] },
        { 'id': '40', 'coords': [18, 39] },
        { 'id': '41', 'coords': [18, 41] },
        { 'id': '42', 'coords': [18, 42] },
        { 'id': '43', 'coords': [18, 44] },
        { 'id': '44', 'coords': [18, 45] },
        { 'id': '45', 'coords': [25, 11] },
        { 'id': '46', 'coords': [25, 15] },
        { 'id': '47', 'coords': [25, 22] },
        { 'id': '48', 'coords': [25, 23] },
        { 'id': '49', 'coords': [25, 24] },
        { 'id': '50', 'coords': [25, 26] },
        { 'id': '51', 'coords': [25, 28] },
        { 'id': '52', 'coords': [25, 29] },
        { 'id': '53', 'coords': [25, 9] },
        { 'id': '54', 'coords': [28, 16] },
        { 'id': '55', 'coords': [28, 20] },
        { 'id': '56', 'coords': [28, 28] },
        { 'id': '57', 'coords': [28, 30] },
        { 'id': '58', 'coords': [28, 34] },
        { 'id': '59', 'coords': [28, 40] },
        { 'id': '60', 'coords': [28, 43] },
        { 'id': '61', 'coords': [28, 47] },
        { 'id': '62', 'coords': [32, 26] },
        { 'id': '63', 'coords': [32, 31] },
        { 'id': '64', 'coords': [33, 15] },
        { 'id': '65', 'coords': [33, 26] },
        { 'id': '66', 'coords': [33, 29] },
        { 'id': '67', 'coords': [33, 31] },
        { 'id': '68', 'coords': [34, 15] },
        { 'id': '69', 'coords': [34, 26] },
        { 'id': '70', 'coords': [34, 29] },
        { 'id': '71', 'coords': [34, 31] },
        { 'id': '72', 'coords': [34, 38] },
        { 'id': '73', 'coords': [34, 41] },
        { 'id': '74', 'coords': [34, 5] },
        { 'id': '75', 'coords': [35, 17] },
        { 'id': '76', 'coords': [35, 31] },
        { 'id': '77', 'coords': [38, 16] },
        { 'id': '78', 'coords': [38, 20] },
        { 'id': '79', 'coords': [38, 30] },
        { 'id': '80', 'coords': [38, 34] },
        { 'id': '81', 'coords': [40, 22] },
        { 'id': '82', 'coords': [41, 23] },
        { 'id': '83', 'coords': [41, 32] },
        { 'id': '84', 'coords': [41, 34] },
        { 'id': '85', 'coords': [41, 35] },
        { 'id': '86', 'coords': [41, 36] },
        { 'id': '87', 'coords': [48, 22] },
        { 'id': '88', 'coords': [48, 27] },
        { 'id': '89', 'coords': [48, 6] },
        { 'id': '90', 'coords': [51, 45] },
        { 'id': '91', 'coords': [51, 47] },
        { 'id': '92', 'coords': [56, 25] },
        { 'id': '93', 'coords': [57, 12] },
        { 'id': '94', 'coords': [57, 25] },
        { 'id': '95', 'coords': [57, 44] },
        { 'id': '96', 'coords': [61, 45] },
        { 'id': '97', 'coords': [61, 47] },
        { 'id': '98', 'coords': [63, 6] },
        { 'id': '99', 'coords': [64, 22] },
        { 'id': '100', 'coords': [71, 11] },
        { 'id': '101', 'coords': [71, 11] },
        { 'id': '102', 'coords': [71, 16] },
        { 'id': '103', 'coords': [71, 45] },
        { 'id': '104', 'coords': [71, 47] },
        { 'id': '105', 'coords': [74, 12] },
        { 'id': '106', 'coords': [74, 16] },
        { 'id': '107', 'coords': [74, 20] },
        { 'id': '108', 'coords': [74, 24] },
        { 'id': '109', 'coords': [74, 29] },
        { 'id': '110', 'coords': [74, 35] },
        { 'id': '111', 'coords': [74, 39] },
        { 'id': '112', 'coords': [74, 6] },
        { 'id': '113', 'coords': [77, 21] },
        { 'id': '114', 'coords': [78, 10] },
        { 'id': '115', 'coords': [78, 32] },
        { 'id': '116', 'coords': [78, 35] },
        { 'id': '117', 'coords': [78, 39] },
        { 'id': '118', 'coords': [79, 10] },
        { 'id': '119', 'coords': [79, 33] },
        { 'id': '120', 'coords': [79, 37] },
        { 'id': '121', 'coords': [80, 10] },
        { 'id': '122', 'coords': [80, 41] },
        { 'id': '123', 'coords': [80, 5] },
        { 'id': '124', 'coords': [81, 17] },
        { 'id': '125', 'coords': [84, 20] },
        { 'id': '126', 'coords': [84, 24] },
        { 'id': '127', 'coords': [84, 29] },
        { 'id': '128', 'coords': [84, 34] },
        { 'id': '129', 'coords': [84, 38] },
        { 'id': '130', 'coords': [84, 6] },
        { 'id': '131', 'coords': [107, 27] },
        
    ];

    const start_id = '1';

    // Se crean valores de configuración
    const data = {
        'start': start_id,  // Punto de partida del viaje
        'circuit': true,  // Indica si el viaje será un circuito
        'cost': create_distance_matrix(locations, true) // Costos
    };

    // Se crean valores de configuración
    const n = 4000;  // Individuos
    const gen = 500;  // Generaciones máximas
    const cp = 0.33;  // Probabilidad de cruza
    const max_mp = 0.00005; // Máxima probabilidad de mutación
    const cycle_mp = 50.0; // Generaciónes por ciclo de mutación
    const elitism = 1.0;  // Porcentaje de elitismo
    const duration = Infinity;  // Duración máxima en segundos
    const verbose = 5;  // Frecuencia de reporte

    // Se crea la tarea
    const task = new Task();

    // Se establecen datos
    task.set_data(data);

    // Se establecen locaciones que aparecen en genomas (todos menos el inicial)
    var genome_points = [];
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].id !== start_id) {
            genome_points.push(locations[i].id);
        }
    }

    // Se crea y asigna la población inicial
    const the_pop = init_permutation_pop(n, genome_points);
    task.set_population(the_pop);

    // Se establecen funciones de cruza, mutacion y selección
    task.set_evals([travel_cost], [-1.0]);
    task.set_mutator(mutate_swap);
    task.set_crossover(crossover_scx);
    task.set_selector(select_vasconcelos, { 'cp': cp });
    // task.set_selector(select_tournament, { 'k': 1, 'matchs': Math.floor(n / 2) });

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
