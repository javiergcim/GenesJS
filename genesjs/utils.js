/**
* Genera una variable aleatoria con distribución geométrica con
* probabilidad *p*.
*
* @var {number} p - Probabilidad del ensayo binomial correspondiente al proceso
* geométrico.
*
* @returns {number} Un valor que corresponde a la variable aleatoria.
**/
export function geometric_dist(p) {
    if (p == 1.0 || p <= 0.0) {
        return p === 1.0 ? 1 : Infinity;
    }
    return Math.ceil(Math.log(1.0 - Math.random()) / Math.log(1.0 - p));
}

/**
* Regresa una variable aleatoria distribuida normalmente. Si *integer* está
* establecido como verdadero, el valor se redondea al entero más próximo.
*
* @param {number} mean - La media de la distribución.
* @param {number} sd - La desviación estándar de la distribución.
* @param {boolean} integer - Una bandera que indica si debe regresarse un valor
* entero.
*
* @returns {float|int} Un valor distribuido normalmente.
**/
export function gauss_dist(mean, sd, integer) {
    const x = 1.0 - Math.random();
    const y = Math.random();
    const v = Math.sqrt(-2.0 * Math.log(x)) * Math.cos(2.0 * Math.PI * y) * sd + mean;

    if (integer) {
        return Math.round(v);
    } else {
        return v;
    }
}

/**
* Convierte un número flotante a una expresión binaria de punto fijo.
* Se buscará encontrar la expresión binaria más cercana posible al número,
* aún si está fuera de rango.
*
* @param {number} num - El número a convertir.
* @param {boolean} sign - Indica si debe usarse bit de signo.
* @param {number} i_dig - Cantidad de digitos para la parte entera.
* @param {number} d_dig - Cantidad de digitos para la mantisa.
*
* @returns {array} Un arreglo con el número codificado en binario.
**/
export function dec_to_bin(num, sign, i_dig, d_dig) {
    let max_abs_value =
        (Math.pow(2, i_dig) - 1) +
        (Math.pow(2, d_dig) - 1) / Math.pow(2, d_dig);

    // Se establece bit se signo (si existe)
    let binary;
    if (sign) {
        if (num < 0.0) {
            binary = ['1'];
        } else {
            binary = ['0'];
        }
    } else {
        binary = [];
    }

    let tmp_binary;
    let abs_num;
    let numint;
    let numdec;
    let binint;
    let bindec;

    if (num < 0.0 && !sign) {  // Debe ser cero
        tmp_binary = new Array(i_dig + d_dig).fill('0');
        binary.concat(tmp_binary);
    } else if (Math.abs(num) >= max_abs_value) {
        tmp_binary = new Array(i_dig + d_dig).fill('1');
        binary.concat(tmp_binary);
    } else {
        abs_num = Math.abs(num);
        numint = Math.floor(abs_num);
        numdec = abs_num - numint;

        // Se crea la parte entera
        binint = new Array(i_dig).fill('0').concat(numint.toString(2).split(''));
        binint = binint.slice(-i_dig);

        // Se crea la parte decimal
        numdec = Math.floor(numdec * Math.pow(2, d_dig));
        bindec = new Array(d_dig).fill('0').concat(numdec.toString(2).split(''));
        bindec = bindec.slice(-d_dig);

        // Se arma la cadena final
        binary = binary.concat(binint);
        binary = binary.concat(bindec);
    }

    return binary;
}

/**
* Crea una permutación al azar in-situ de *elements* con el algoritmo
* Fisher-Yates.
*
* Fisher, R. A., & Yates, F. (1943). Statistical tables for biological,
* agricultural and medical research. Oliver and Boyd Ltd, London.
*
* *Asunciones:*
* Se asume que el arreglo posee indices númerados de *0* a
* *elements.length - 1*.
*
* @param {array} elements - Un arreglo con los elementos a permutar.
**/
export function fisher_yates(elements) {
    let max = elements.length;
    let r;
    let temp;

    while (max > 0) {
        r = Math.floor(Math.random() * max);
        max--;

        temp = elements[r];
        elements[r] = elements[max];
        elements[max] = temp;
    }
}

/**
 * Elige n elementos al azar sin reemplazo de un arreglo, utilizando una variante
 * del algoritmo Fisher-Yates. Los elementos son escogidos solo en el rango
 * especificado.
 *
 * Fisher, R. A., & Yates, F. (1943). Statistical tables for biological,
 * agricultural and medical research. Oliver and Boyd Ltd, London.
 *
 * *Asunciones:*
 * Se asume que el arreglo posee indices númerados de 0 a (elements.length - 1).
 *
 * @param {number} min Parámetro mínimo para el rango.
 * @param {number} max Parámetro máximo para el rango.
 * @param {number} n La cantidad de elementos a elegir. Debe estar entre 1 y la
 * diferencia (max - min).
 *
 * @returns {array} Un arreglo con los índices de los elementos seleccionados.
 */
export function sample_for_range(min, max, n) {
    const elements = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    const max_i = max - min;
    let i = 0;
    let r;
    let temp;
    while (i <= n) {
        r = Math.floor(Math.random() * (max_i - i + 1)) + i;
        temp = elements[r];
        elements[r] = elements[i];
        elements[i] = temp;
        i++;
    }

    return elements.slice(0, n);
}

/**
 * Calcula la distancia euclidea entre dos puntos.
 * 
 * @param {array} a - Coordenadas del primer punto.
 * @param {array} b - Coordenadas del segundo punto.
 * 
 * @returns {number} La distancia euclidea entre ambos puntos.
 */
export function euclidean_distance(a, b) {
    return a.map((x, i) => Math.abs( x - b[i] )**2)
            .reduce((sum, now) => sum + now)**(0.5)
}

/**
* Calcula la distancia entre dos puntos de la Tierra, con la fórmula de
* Haversine.
*
* @param {number} lat_from Latitud del punto A en grados.
* @param {number} long_from Longitud del punto A en grados.
* @param {number} lat_to Latitud del punto B en grados.
* @param {number} long_to Longitud del punto B en grados.
* @param {number} sphere_radius Radio de la esfera.
*
* @return {number} Distancia entre los puntos en la unidad de *sphere_radius*.
**/
export function haversine_distance(
    lat_from,
    long_from,
    lat_to,
    long_to,
    sphere_radius = 6371000.0
) {
    // Convertimos de grados a radianes
    lat_from = lat_from * (Math.PI / 180.0);
    long_from = long_from * (Math.PI / 180.0);
    lat_to = lat_to * (Math.PI / 180.0);
    long_to = long_to * (Math.PI / 180.0);

    let lat_delta = lat_to - lat_from;
    let long_delta = long_to - long_from;

    let angle = 2.0 * Math.asin(Math.sqrt(Math.pow(Math.sin(lat_delta / 2.0), 2) +
        Math.cos(lat_from) * Math.cos(lat_to) * Math.pow(Math.sin(long_delta / 2.0), 2)));

    return angle * sphere_radius;
}

/**
 * Crea la matriz de distancias entre un conjunto de puntos, dados de la forma:
 * { 'id': id, 'latitude': lat, 'longitude': long }
 *
 * @param {array} points Un arreglo con los puntos a calcular sus distancias.
 * @param {boolean} euclidean Indica si las distancias son euclideas. En ese caso, los puntos
 * son n-dimensionles, y se encuentran almacenados en un arreglo.
 *
 * @returns {array} Una matriz cuadrada con las distancias entre los puntos.
 */
export function create_distance_matrix(points, euclidean = false) {
    // Creamos un mapa de puntos
    const pointsMap = new Map();
    for (let i = 0; i < points.length; i++) {
        pointsMap.set(points[i].id, i);
    }

    const matrix = {};

    // Inicializamos la primera dimensión de la matriz
    for (const value of points) {
        matrix[value.id] = {};
    }

    // Calculamos los costos
    for (const valueFrom of points) {
        const keyFrom = valueFrom.id;

        for (const valueTo of points) {
            const keyTo = valueTo.id;

            if (keyFrom === keyTo) {
                matrix[keyFrom][keyTo] = 0.0;
                break;
            }

            if (euclidean) {
                matrix[keyFrom][keyTo] = euclidean_distance(
                    points[pointsMap.get(keyFrom)].coords,
                    points[pointsMap.get(keyTo)].coords
                );
            } else {
                matrix[keyFrom][keyTo] = haversine_distance(
                    points[pointsMap.get(keyFrom)].latitude,
                    points[pointsMap.get(keyFrom)].longitude,
                    points[pointsMap.get(keyTo)].latitude,
                    points[pointsMap.get(keyTo)].longitude
                );
            }


            matrix[keyTo][keyFrom] = matrix[keyFrom][keyTo];
        }
    }

    return matrix;
}

/**
* Costo de un viaje del tipo "agente viajero".
*
* @param {Array} genome El genoma a evaluar.
* @param {*} data Un objeto arbitrario.
*
* @returns {number} La evaluación del individuo.
*/
export function travel_cost(genome, data) {
    const start = data.start;
    const max_i = genome.length - 2;
    const matrix = data.cost;
    let cost = matrix[start][genome[0]];

    for (let i = 0; i <= max_i; i++) {
        cost += matrix[genome[i]][genome[i + 1]];
    }

    if (data.circuit) {
        cost += matrix[genome[genome.length - 1]][start];
    }

    return cost;
}