/*File: filesqlname.js
Versione: v0.1
Autore: Sharon Della Libera
Registro Modifiche: Sharon Della Libera, scrittura metodi
*/
/*ritorna il modulo per il calcolo del nome del file java*/
var getFileJavaName = function(arrEntity) {
    return arrEntity.text + ".java";
}
module.exports = getFileJavaName;