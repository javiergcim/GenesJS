/**
* Clase base para los individuos.
*
* @property {array} genome - El genoma del individuo.
* @property {*} fitness - Un arreglo de valores fitness.
* @property {*} data - Una variable arbitraria que contiene datos adjuntos al
* individuo
**/
export class Individual {

    /**
    * Constructor de la clase  *Individual*.
    *
    * @param {array|string} genome - Un arreglo con el genoma en su forma bruta.
    * @param {*} data - Una variable arbitraria.
    * @param {*} fitness - Un arreglo con el fitness.
    **/
    constructor(genome, data = null, fitness = null) {
        this.genome = genome;
        this.fitness = fitness;
        this.data = data;
    }

    /**
    * Regresa una representación en cadena del individuo.
    *
    * @returns {string} Una representación en cadena del objeto.
    **/
    toString() {
        if (this.genome === null) {
            var gen = '(none)';
        } else {
            var gen = '[' + this.genome.join(', ') + ']';
        }

        if (this.fitness === null) {
            var fit = '(none)';
        } else {
            var fit = '[' + this.fitness.join(', ') + ']';
        }

        if (this.data === null) {
            var data = '(none)';
        } else {
            var data = JSON.stringify(this.data);
        }

        var str = 'Genome: ' + gen + '\n' +
            'Fitness: ' + fit + '\n' +
            'Data: ' + data + '\n';

        return str;
    }

    /**
     * Regresa una copia dura del objeto.
     * 
     * @returns {object} Una copia dura del objeto.
     */
    clone() {
        return new Individual(
            [...this.genome],
            this.data,
            this.fitness === null ? null : [...this.fitness]
        );
    }

    /**
    * Regresa el genoma del individuo en forma amigable.
    *
    * @returns {array} Una secuencia con el genoma.
    **/
    get_genome() {
        return this.genome;
    }

    /**
    * Regresa el genoma del individuo en forma bruta.
    *
    * @returns {array} Una secuencia con el genoma.
    **/
    get_raw_genome() {
        return this.genome;
    }

    /**
    * Establece el genoma desde una versión amigable del mismo.
    *
    * @param {array} genome - Un arreglo con el genoma en forma decodificada o
    * amigable.
    **/
    set_genome(genome) {
        this.genome = genome;
    }

    /**
    * Establece el genoma desde una versión en bruto del mismo.
    *
    * @param {array} genome - Un arreglo con el genoma en bruto, tal cual es
    * almacenado en el individuo.
    **/
    set_genome_from_raw(genome) {
        this.genome = genome;
    }

    /**
    * Regresa el fitness del individuo.
    *
    * Regresa el arreglo de *fitness*.
    *
    * @returns {array|number} Una secuencia con el fitness elegido.
    **/
    get_fitness(i = null) {
        if (i === null) {
            return this.fitness;
        }
        else {
            return this.fitness[i];
        }
    }

    /**
    * Establece el fitness del individuo.
    *
    * @param {array} i - Un arreglo con el fitness del individuo.
    *
    **/
    set_fitness(fit) {
        this.fitness = fit;
    }

    /**
    * Regresa los datos arbitrarios asociados al individuo.
    *
    * @returns {*} Devuelve los datos arbitrarios asociados al individuo.
    **/
    get_data() {
        return this.data;
    }

    /**
    * Establece los datos arbitrarios asociados al individuo.
    *
    * @param {*} data Una variable arbitraria que se asignará al individuo.
    **/
    set_data(data) {
        this.data = data;
    }

    /**
    * Regresa la longitud del genoma.
    *
    * @returns {number} La longitud del genoma.
    **/
    get_size() {
        return this.genome.length;
    }
}