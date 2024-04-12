/**
* Hace un cruzamiento de genomas que codifican una permutación de destinos
* para el problema del agente viajero, inspirado en SCX.
*
* El algoritmo genera dos hijos. Uno calculado de derecha a izquierda y otro
* de izquierda a derecha.
*
* Se asume que el primer objetivo de la tarea asociada determina si el
* problema se maximiza o minimiza.
* 
* Ahmed, Z. H. (2010). Genetic algorithm for the traveling salesman problem
* using sequential constructive crossover operator. International Journal of
* Biometrics & Bioinformatics (IJBB), 3(6), 96.
*
* *Asunciones:*
*
* Se asume que el genoma no posee elementos repetidos, que el primer
* elemento del recorrido (la salida), no se encuentra en el genoma y es fijo.
*
* @param {object} task - El objeto Task asociado al problema.
* @param {object} ind_a - El primer individuo a cruzar.
* @param {object} ind_b - El segundo individuo a cruzar.
* @param {object} args - Los parámetros propios del método.
*
* @returns {array}: Un arreglo con dos individuos descendientes.
**/
export function crossover_scx(task, ind_a, ind_b, args) {
    // Tomamos las variables requeridas de la tarea
    const data = task.get_data();
    const cost = data['cost'];
    const start = data['start'];
    const circuit = data['circuit'];
    const obj_factors = task.get_obj_factors();
    const minim = obj_factors[0] > 0.0 ? false : true;

    // Iniciamos el proceso de cruza
    const gen_a = ind_a.get_raw_genome();
    const gen_b = ind_b.get_raw_genome();

    // Tamaño de los genomas (todos miden lo mismo)
    const size = gen_a.length;
    const size_1 = size - 1;

    // Creamos arreglos con elementos de gen_a y gen_b como sus llaves, y sus
    // llaves como valores, a fin de encontrarlos rápido.
    const map_a = new Map();
    const map_b = new Map();
    for (let i = 0; i < size; i++) {
        map_a.set(gen_a[i], i);
        map_b.set(gen_b[i], i);
    }

    // Conjuntos que nos indican los elementos legítimos de cada hijo.
    const legal_nodes_l = new Set(gen_a);
    const legal_nodes_r = new Set(legal_nodes_l);

    // Inicio de hijo izquierdo (son_l) -----------------------------------------

    // Se inicializa el genoma del futuro hijo
    const son_l_gen = [];

    // Se calcula el costo para el elemento apuntalado (la salida)
    var cost_a = cost[start][gen_a[0]];
    var cost_b = cost[start][gen_b[0]];

    // Se elige el nodo que se agregará al genoma del hijo
    let last_added_l;
    if ((cost_a < cost_b) !== minim) {
        last_added_l = gen_b[0];
    } else {
        last_added_l = gen_a[0];
    }
    son_l_gen.push(last_added_l);

    // Se elimina de los elementos legales el elemento agregado al hijo
    legal_nodes_l.delete(last_added_l);

    // Inicio de hijo derecho (son_r) -------------------------------------------

    // Se inicializa el genoma del futuro hijo
    const son_r_gen = new Array(size).fill(null);

    // Inicializamos posición
    let current_index = size_1;

    // Se calcula el costo para el elemento final
    cost_a = cost[gen_a[size_1]][start];
    cost_b = cost[gen_b[size_1]][start];

    let last_added_r;
    if (circuit) {
        if ((cost_a < cost_b) !== minim) {
            last_added_r = gen_b[size_1];
        } else {
            last_added_r = gen_a[size_1];
        }
    } else {
        if ((cost_a > cost_b) !== minim) {
            last_added_r = gen_b[size_1];
        } else {
            last_added_r = gen_a[size_1];
        }
    }

    son_r_gen[current_index] = last_added_r;

    // Se elimina de los elementos legales el elemento agregado al hijo
    legal_nodes_r.delete(last_added_r);
    current_index--;

    // Ciclo principal. Se agrega hasta que no haya que agregar
    var candidate_a;
    var candidate_b;
    while (current_index >= 0) {
        // Sección de hijo izquierdo --------
        let not_found = true;

        // Buscamos el nodo legal en 'a'
        for (let i = map_a.get(last_added_l) + 1; i < size; i++) {
            if (legal_nodes_l.has(gen_a[i])) {
                candidate_a = gen_a[i];
                not_found = false;
                break;
            }
        }

        // No se encontró nodo legal en 'a' después del último añadido
        if (not_found) {
            for (let i = 0; i < size; i++) {
                if (legal_nodes_l.has(gen_a[i])) {
                    candidate_a = gen_a[i];
                    break;
                }
            }
        }

        cost_a = cost[last_added_l][candidate_a];

        not_found = true;

        // Buscamos el nodo legal en 'b'
        for (let i = map_b.get(last_added_l) + 1; i < size; i++) {
            if (legal_nodes_l.has(gen_b[i])) {
                candidate_b = gen_b[i];
                not_found = false;
                break;
            }
        }

        // No se encontró nodo legal en 'b' después del último añadido
        if (not_found) {
            for (let i = 0; i < size; i++) {
                if (legal_nodes_l.has(gen_b[i])) {
                    candidate_b = gen_b[i];
                    break;
                }
            }
        }

        cost_b = cost[last_added_l][candidate_b];

        // Se elige el nodo que se agregará al genoma del hijo
        if ((cost_a < cost_b) !== minim) {
            last_added_l = candidate_b;
        } else {
            last_added_l = candidate_a;
        }

        son_l_gen.push(last_added_l);

        // Se elimina de los elementos legales el elemento agregado al hijo
        legal_nodes_l.delete(last_added_l);

        // Sección de hijo derecho --------
        not_found = true;

        // Buscamos el nodo legal en 'a'
        for (let i = map_a.get(last_added_r) - 1; i >= 0; i--) {
            if (legal_nodes_r.has(gen_a[i])) {
                candidate_a = gen_a[i];
                not_found = false;
                break;
            }
        }

        // No se encontró nodo legal en 'a' después del último añadido
        if (not_found) {
            for (let i = size_1; i >= 0; i--) {
                if (legal_nodes_r.has(gen_a[i])) {
                    candidate_a = gen_a[i];
                    break;
                }
            }
        }

        cost_a = cost[candidate_a][last_added_r];

        not_found = true;

        // Buscamos el nodo legal en 'b'
        for (let i = map_b.get(last_added_r) - 1; i >= 0; i--) {
            if (legal_nodes_r.has(gen_b[i])) {
                candidate_b = gen_b[i];
                not_found = false;
                break;
            }
        }

        // No se encontró nodo legal en 'b' después del último añadido
        if (not_found) {
            for (let i = size_1; i >= 0; i--) {
                if (legal_nodes_r.has(gen_b[i])) {
                    candidate_b = gen_b[i];
                    break;
                }
            }
        }

        cost_b = cost[candidate_b][last_added_r];

        // Se elige el nodo que se agregará al genoma del hijo
        if ((cost_a < cost_b) !== minim) {
            last_added_r = candidate_b;
        } else {
            last_added_r = candidate_a;
        }

        son_r_gen[current_index] = last_added_r;

        // Se elimina de los elementos legales el elemento agregado al hijo
        legal_nodes_r.delete(last_added_r);
        current_index--;
    }

    // Se instancian los hijos
    const a = ind_a.clone();
    a.set_genome_from_raw(son_l_gen);
    a.set_fitness(null);
    const b = ind_b.clone();
    b.set_genome_from_raw(son_r_gen);
    b.set_fitness(null);

    return [a, b];
}

/**
* Hace un cruzamiento de genomas que codifican una permutación, inspirado
* en SCX.
*
* Esta versión no considera una matriz de costos. Los nodos son insertados
* siguiendo un esquema determinista.
*
* El algoritmo genera dos hijos. Uno calculado de derecha a izquierda y otro de
* izquierda a derecha.
*
* Se asume que el primer objetivo de la tarea asociada determina si el problema
* se maximiza o minimiza.
*
* Ahmed, Z. H. (2010). Genetic algorithm for the traveling salesman problem
* using sequential constructive crossover operator. International Journal of
* Biometrics & Bioinformatics (IJBB), 3(6), 96.
*
* *Asunciones:*
*
* Se asume que el genoma no posee elementos repetidos, que el primer
* elemento del recorrido (la salida), no se encuentra en el genoma y es fijo.
*
* @param {object} task - El objeto Task asociado al problema.
* @param {object} ind_a - El primer individuo a cruzar.
* @param {object} ind_b - El segundo individuo a cruzar.
* @param {array} args - Los parámetros propios del método.
*
* @return {array} Un arreglo con dos individuos descendientes.
**/
export function crossover_pseudoscx(task, ind_a, ind_b, args) {
    // Iniciamos el proceso de cruza
    const gen_a = ind_a.get_raw_genome();
    const gen_b = ind_b.get_raw_genome();

    // Tamaño de los genomas (todos miden lo mismo)
    const size = gen_a.length;
    const size_1 = size - 1;

    // Creamos arreglos con elementos de gen_a y gen_b como sus llaves, y sus
    // llaves como valores, a fin de encontrarlos rápido.
    const map_a = new Map();
    const map_b = new Map();
    for (let i = 0; i < size; i++) {
        map_a.set(gen_a[i], i);
        map_b.set(gen_b[i], i);
    }

    // Conjuntos que nos indican los elementos legítimos de cada hijo.
    const legal_nodes_l = new Set(gen_a);
    const legal_nodes_r = new Set(legal_nodes_l);

    // Inicio de hijo izquierdo (son_l) -----------------------------------------

    // Se inicializa el genoma del futuro hijo (inicia con gen_a)
    let last_added_l = gen_a[0];
    const son_l_gen = [last_added_l];

    // Se elimina de los elementos legales el elemento agregado al hijo
    legal_nodes_l.delete(last_added_l);

    // Inicio de hijo derecho (son_r) -------------------------------------------

    // Se inicializa el genoma del futuro hijo
    let last_added_r = gen_a[size - 1];
    const son_r_gen = Array(size).fill(null);
    son_r_gen[size - 1] = last_added_r;

    // Inicializamos posición
    let current_index = size_1 - 1;

    // Se elimina de los elementos legales el elemento agregado al hijo
    legal_nodes_r.delete(last_added_r);

    // Ciclo principal. Se agrega hasta que no haya que agregar
    var next_source = 'a';
    var not_found;
    while (current_index >= 0) {
        if (next_source == 'a') {
            next_source = 'b';
        }
        else {
            next_source = 'a';
        }

        // Sección de hijo izquierdo --------
        if (next_source === 'a') {
            // Buscamos el nodo legal en 'a' ---
            not_found = true;
            for (let i = map_a.get(last_added_l) + 1; i < size; i++) {
                if (legal_nodes_l.has(gen_a[i])) {
                    last_added_l = gen_a[i];
                    not_found = false;
                    break;
                }
            }

            // No se encontró nodo legal en 'a' después del último añadido
            if (not_found) {
                for (let i of gen_a) {
                    if (legal_nodes_l.has(i)) {
                        last_added_l = i;
                        break;
                    }
                }
            }
        } else {
            // Buscamos el nodo legal en 'b' ---
            not_found = true;
            for (let i = map_b.get(last_added_l) + 1; i < size; i++) {
                if (legal_nodes_l.has(gen_b[i])) {
                    last_added_l = gen_b[i];
                    not_found = false;
                    break;
                }
            }

            // No se encontró nodo legal en 'b' después del último añadido
            if (not_found) {
                for (let i of gen_b) {
                    if (legal_nodes_l.has(i)) {
                        last_added_l = i;
                        break;
                    }
                }
            }
        }

        son_l_gen.push(last_added_l);

        // Se elimina de los elementos legales el elemento agregado al hijo
        legal_nodes_l.delete(last_added_l);

        // Sección de hijo derecho --------

        if (next_source === 'a') {
            // Buscamos el nodo legal en 'a' ---
            not_found = true;
            for (let i = map_a.get(last_added_r) - 1; i >= 0; i--) {
                if (legal_nodes_r.has(gen_a[i])) {
                    last_added_r = gen_a[i];
                    not_found = false;
                    break;
                }
            }

            // No se encontró nodo legal en 'a' después del último añadido
            if (not_found) {
                for (let i = size_1; i >= 0; i--) {
                    if (legal_nodes_r.has(gen_a[i])) {
                        last_added_r = gen_a[i];
                        break;
                    }
                }
            }
        } else {
            // Buscamos el nodo legal en 'b' ---
            not_found = true;
            for (let i = map_b.get(last_added_r) - 1; i >= 0; i--) {
                if (legal_nodes_r.has(gen_b[i])) {
                    last_added_r = gen_b[i];
                    not_found = false;
                    break;
                }
            }

            // No se encontró nodo legal en 'b' después del último añadido
            if (not_found) {
                for (let i = size_1; i >= 0; i--) {
                    if (legal_nodes_r.has(gen_b[i])) {
                        last_added_r = gen_b[i];
                        break;
                    }
                }
            }
        }

        son_r_gen[current_index] = last_added_r;

        // Se elimina de los elementos legales el elemento agregado al hijo
        legal_nodes_r.delete(last_added_r);
        current_index--;
    }

    // Se instancian los hijos
    const a = ind_a.clone();
    a.set_genome_from_raw(son_l_gen);
    a.set_fitness(null);
    const b = ind_b.clone();
    b.set_genome_from_raw(son_r_gen);
    b.set_fitness(null);

    return [a, b];
}

/**
 * Realiza un cruzamiento de dos individuos, mezclando los genomas aplicando un
 * corte.
 *
 * @param {object} task - El objeto Task asociado al problema.
 * @param {object} ind_a - El primer individuo a cruzar.
 * @param {object} ind_b - El segundo individuo a cruzar.
 *
 * @return {array} Un arreglo con dos Individuos descendentes.
 **/
export function crossover_one_point(task, ind_a, ind_b, args) {
    // Elegimos al azar el punto de corte
    const gen_a = ind_a.get_raw_genome();
    const gen_b = ind_b.get_raw_genome();

    const cut_point = Math.floor(Math.random() * (gen_a.length - 1)) + 1;
    const left_a = gen_a.slice(0, cut_point);
    const right_a = gen_a.slice(cut_point);

    const left_b = gen_b.slice(0, cut_point);
    const right_b = gen_b.slice(cut_point);

    const son_l_gen = left_a.concat(right_b);
    const son_r_gen = left_b.concat(right_a);

    // Se instancian los hijos
    const a = ind_a.clone();
    a.set_genome_from_raw(son_l_gen);
    a.set_fitness(null);
    const b = ind_b.clone();
    b.set_genome_from_raw(son_r_gen);
    b.set_fitness(null);

    return [a, b];
}

/**
 * Realiza un cruzamiento de dos individuos, mezclando los genomas aplicando dos
 * cortes.
 *
 * @param {object} task - El objeto Task asociado al problema.
 * @param {object} ind_a - El primer individuo a cruzar.
 * @param {object} ind_b - El segundo individuo a cruzar.
 *
 * @return {array} Un arreglo con dos Individuos descendentes.
 **/
export function crossover_two_points(task, ind_a, ind_b, args) {
    // Elegimos al azar el punto de corte
    const gen_a = ind_a.get_raw_genome();
    const gen_b = ind_b.get_raw_genome();

    const cut_a = Math.floor(Math.random() * gen_a.length);
    const cut_b = Math.floor(Math.random() * gen_a.length);

    const [start, end] = [Math.min(cut_a, cut_b), Math.max(cut_a, cut_b)];

    const left_a = gen_a.slice(0, start);
    const center_a = gen_a.slice(start, end);
    const right_a = gen_a.slice(end);

    const left_b = gen_b.slice(0, start);
    const center_b = gen_b.slice(start, end);
    const right_b = gen_b.slice(end);

    const son_l_gen = left_a.concat(center_b, right_a);
    const son_r_gen = left_b.concat(center_a, right_b);

    // Se instancian los hijos
    const a = ind_a.clone();
    a.set_genome_from_raw(son_l_gen);
    a.set_fitness(null);
    const b = ind_b.clone();
    b.set_genome_from_raw(son_r_gen);
    b.set_fitness(null);

    return [a, b];
}