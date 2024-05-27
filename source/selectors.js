// import { sample_for_range } from '../../genesjs/utils.js';
import { sample_for_range } from './utils.js';

/**
* Realiza cruzas con el método Vasconcelos, con probabilidad *cp*. Los cambios
* en la población son realizados in-situ en el objeto Task pasado como
* referencia. Los hijos sustituyen a los padres.
*
* Se asume que hay definida una función de cruza que regresa dos descendientes.
*
* @param {object} task - Una referencia la tarea invoulcrada.
* @param {object} args - Un objeto con los argumentos propios de la función. cp
* indica la propabilidad de cruzamiento.
**/
export function select_vasconcelos(task, args) {
    var cp = args.cp;
    var mayor = task.get_size() - 1;
    var max_minor = Math.floor(mayor / 2.0);
    var population = task.get_population();

    // Hacemos la selección (mejor contra peor)
    for (var minor = 0; minor <= max_minor; minor++) {
        // Si el dado favorece, se hace la cruza
        var p = Math.random();
        if (p < cp) {
            var childs = task.apply_crossover(
                population[minor],
                population[mayor]
            );

            population[minor] = childs[0];
            population[mayor] = childs[1];
        }
        mayor--;
    }

    task.replace_population(population);
}

/**
* Realiza cruzas utilizando el método de selección por torneo, eligiendo dos
* padres para cada cruza, y anexando al final los descendientes resultantes a la
* población actual de la tarea.
*
* Se asume que hay definida una función de cruza que regresa dos descendientes.
*
* @param {object} task - Una referencia la tarea involucrada.
* @param {object} args - Un objeto con los argumentos propios de la función. 'k'
* indica el número de individuos en el torneo.
**/
export function select_tournament(task, args) {
    var k = args.k;
    var obj_index = args.obj_index || 0;
    var population = task.get_population();
    var pop_max_i = population.length - 1;
    var p_type = task.get_obj_factors(obj_index);
    var matchs = args.matchs;
    var childs = {};

    for (var pair = 0; pair < matchs; pair++) {
        // Elegimos padres
        var p = 0;
        var parents_index = [];
        while (p < 2) {
            // Hago el torneo
            var tournament = sample_for_range(0, pop_max_i, k);
            var best = null;
            var best_i = null;

            for (var i = 0; i < tournament.length; i++) {
                var current_fitness = population[tournament[i]].get_fitness(obj_index);
                // Verificamos si es maximización o minimización
                if (p_type > 0.0) {
                    if (best === null || current_fitness > best) {
                        best = current_fitness;
                        best_i = tournament[i];
                    }
                } else {
                    if (best === null || current_fitness < best) {
                        best = current_fitness;
                        best_i = tournament[i];
                    }
                }
            }

            parents_index.push(best_i);
            p++;
        }

        var sons = task.apply_crossover(
            population[parents_index[0]],
            population[parents_index[1]]
        );

        childs[parents_index[0]] = sons[0];
        childs[parents_index[1]] = sons[1];
    }
    
    // Se integra toda la descendencia en la población (sustituyen a padres)
    for (const [index, new_born] of Object.entries(childs)) {
        population[index] = new_born;
        // population.push(new_born);
    }

    task.replace_population(population);
}
