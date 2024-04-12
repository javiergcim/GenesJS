import { Individual } from '../../genesjs/individual.js';

/**
* Clase para individuos con genoma binario.
*
* @property {array} var_bits - Arreglo que indica cuantos bits usa cada
* variable en el genoma.
* @property {array} sign_bits - Arreglo que indica que variables poseen bit de
* signo.
* @property {array} precalc - Un arreglo que almacena factores que ajustan el
* valor entero codificado en cada variable a su valor flotante correcto.
* @property {array} struct - Un arreglo de arreglos que indican la forma en que
* se codifica cada variable almacenado en el genoma.
**/
export class BinaryInd extends Individual {
    /**
    * Constructor de la clase *BinaryInd*.
    *
    * @param {array} genome - Una lista con el genoma en su forma bruta.
    * @param {array} var_bits - Arreglo que indica cuantos bits usa cada
    * variable en el genoma.
    * @param {array} sign_bits - Arreglo que indica que variables poseen bit de
    * signo.
    * @param {array} precalc - Un arreglo que almacena factores que ajustan el
    * valor entero codificado en cada variable a su valor flotante correcto.
    * @param {*} data - Un objeto arbitrario.
    * @param {*} fitness - Un arreglo con el fitness.
    **/
    constructor(
        genome,
        var_bits,
        sign_bits,
        precalc,
        struct,
        data = null,
        fitness = null) {

        super(genome, data, fitness);

        this.var_bits = var_bits;
        this.sign_bits = sign_bits;
        this.precalc = precalc;
        this.struct = struct;
    }

    /**
     * Regresa una copia dura del objeto.
     * 
     * @returns {object} Una copia dura del objeto.
     */
    clone() {
        return new BinaryInd(
            [...this.genome],
            this.var_bits,
            this.sign_bits,
            this.precalc,
            this.struct,
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
        var nice_genome = [];
        var genome = this.genome.join('');
        var n_vars = this.var_bits.length;
        var left = 0;

        var v;
        var s;
        var p;

        for (let i = 0; i < n_vars; i++) {
            v = this.var_bits[i];
            s = this.sign_bits[i];
            p = this.precalc[i];

            if (s) {  // Si tiene bit de signo
                if (genome[left] == '0') {  // Positivo
                    nice_genome.push(parseInt(genome.substring(left + 1, left + v), 2) * p);
                }
                else {  // Negativo
                    nice_genome.push(-parseInt(genome.substring(left + 1, left + v), 2) * p);
                }
            }
            else {
                nice_genome.push(parseInt(genome.substring(left, left + v), 2) * p);
            }

            left += v;
        }

        return nice_genome;
    }

    /**
     * Recibe un genoma en su forma amigable y lo transforma en la forma
     * cruda para ser almacenado en el individuo.
     *
     * El genoma debe ser compatible con las especificaciones establecidas en
     * los atributos del individuo, como "var_bits" y "sign_bits".
     *
     * @param {array} genome El genoma en su forma amigable.
     */
    set_genome(genome) {
        const n_vars = this.var_bits.length;
        const struct = this.struct;
        let new_raw = [];

        for (let i = 0; i < n_vars; i++) {
            new_raw = new_raw.concat(
                dec_to_bin(
                    genome[i],
                    struct[i][0],
                    struct[i][1],
                    struct[i][2]
                )
            );
        }

        this.genome = new_raw;
    }
}