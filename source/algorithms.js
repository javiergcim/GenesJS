/**
 * Ejecuta un algoritmo genético genérico, con posibilidad de elitismo.
 *
 * @param {object} task Un objeto Task con los parámetros y la población requerida
 * para la ejecución del algoritmo.
 * @param {number} elitism Porcentaje de individuos que se guardarán como elite
 * para la siguiente generación.
 * @param {number} sec Segundos que aproximadamente correrá el algoritmo.
 * @param {number} gen Generaciones que se ejecutará el algoritmo genético.
 * @param {number} verbose Indica cada cuántas generaciones se reportan avances.
 *
 * @return {object} El individuo con mejor aptitud al momento de finalizar la
 * corrida.
 */
export function general_ga(task, elitism, sec, gen = Infinity, verbose = Infinity) {
    // Se inicia la toma de tiempo
    const start_time = Date.now();

    // Se precalcula el número de individuos elite
    const n_elite = Math.floor(task.get_size() * elitism);

    task.evaluate();
    task.order_population();

    var elite_pop;
    for (let g = 0; g < gen; g++) {
        task.set_generation(g);

        elite_pop = task.get_subpopulation_copy(0, n_elite);
        task.apply_selection();
        task.mutate();
        task.evaluate();
        task.append_population(elite_pop, true);
        task.remove_duplicate_fitness();
        if (task.adjust_population_size()) {
            task.evaluate();
            task.order_population();
        }

        // Se verifica si se debe imprimir
        if (verbose !== Infinity) {
            if (g % verbose === 0) {
                console.log('Generation: ' + g);
                console.log('Best fitness: ' + task.get_individual(0).get_fitness().join(', ') + '\n');
            }
        }

        // Verificamos si se ha cumplido el tiempo
        const current_time = (Date.now() - start_time) / 1000;
        if (current_time > sec) {
            break;
        }
    }

    task.set_generation(null);

    // Se regresa la solución (el mejor es el primer elemento)
    return task.get_individual(0);
}

/**
 * Ejecuta un algoritmo genético genérico, con posibilidad de elitismo, que
 * genera una probabilidad de mutación `max_mp` variable a lo largo de las
 * generaciones, de acuerdo con una función coseno.
 *
 * @param {object} task Un objeto Task con los parámetros y la población requerida
 * para la ejecución del algoritmo.
 * @param {number} max_mp Probabilidad máxima de mutación.
 * @param {number} cycle_mp Indica cuántas generaciones dura un ciclo en el
 * cambio de valor de la probabilidad de mutación.
 * @param {number} elitism Porcentaje de individuos que se guardarán como elite
 * para la siguiente generación.
 * @param {number} sec Segundos que aproximadamente correrá el algoritmo.
 * @param {number} gen Generaciones que se ejecutará el algoritmo genético.
 * @param {number} verbose Indica cada cuántas generaciones se reportan avances.
 * @param {function} report Función de reporte. Recibirá la generación y mejor
 * fitness de la iteración actual, cada tantas generaciones como se especifique
 * según *verbose*.
 *
 * @return {object} El individuo con mejor aptitud al momento de finalizar la
 * corrida.
 */
export function cos_mutation_ga(
    task,
    max_mp,
    cycle_mp,
    elitism,
    sec,
    gen = Infinity,
    verbose = Infinity,
    report = null
) {
    // Se inicia la toma de tiempo
    const start_time = Date.now();

    // Ajustamos factores alusivos a mp variable
    cycle_mp = (2.0 * Math.PI) / cycle_mp;
    const half_max_mp = max_mp / 2.0;

    // Calculamos la probabilidad de mutación para esta generación
    task.set_mutator_arg('mp', max_mp);

    // Se precalcula el número de individuos elite
    const n_elite = Math.floor(task.get_size() * elitism);

    task.evaluate();
    task.order_population();


    var elite_pop;
    for (let g = 0; g < gen; g++) {
        task.set_generation(g);

        // Calculamos la probabilidad de mutación para esta generación
        task.set_mutator_arg(
            'mp',
            Math.cos(g * cycle_mp) * half_max_mp + half_max_mp
        );

        elite_pop = task.get_subpopulation_copy(0, n_elite);

        task.apply_selection();
        task.mutate();
        task.evaluate();
        task.append_population(elite_pop, true);
        task.remove_duplicate_fitness();

        if (task.adjust_population_size()) {
            task.evaluate();
            task.order_population();
        }

        // Se verifica si se debe imprimir
        if (verbose !== Infinity) {
            if (g % verbose === 0) {
                if (report !== null) {
                    report(g, task.get_individual(0).get_fitness(), task.get_individual(0).get_genome());
                } else {
                    console.log('Generation: ' + g);
                    console.log('Best fitness: ' + task.get_individual(0).get_fitness().join(', ') + '\n');
                }
            }
        }

        // Verificamos si se ha cumplido el tiempo
        const current_time = (Date.now() - start_time) / 1000;
        if (current_time >= sec) {
            break;
        }
    }

    // Se regresa la solución (el mejor es el primer elemento)
    return task.get_individual(0);
}
