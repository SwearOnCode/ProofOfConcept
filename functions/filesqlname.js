/*File: filesqlname.js
Versione: v0.1
Autore: Sharon Della Libera
Registro Modifiche: Sharon Della Libera, scrittura metodi
*/

/*ritorna il modulo per il calcolo del nome del file sql*/
var getFileSqlName = function(arrEntity) {
    return arrEntity.text + ".sql";
}
module.exports = getFileSqlName;