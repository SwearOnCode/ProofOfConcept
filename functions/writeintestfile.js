/*File: writeintestfile.js
Versione: v0.1
Autore: Sharon Della Libera
Registro Modifiche: Sharon Della Libera, scrittura metodi
*/

/*I metodi raccolti in methods scrivono l'intestazione del file java o sql in base alla richiesta require
nel file principale*/
var fs = require('fs');
var methods = {
    WriteIntJava: function(fileJava, arrEntity) {
        fs.writeFileSync(fileJava, arrEntity.accesso + " class " + arrEntity.text + "{\n", function(err) {
            if(err)
                throw err;
        })
    },
    WriteIntSql: function(fileSql, arrEntity) {
        fs.writeFileSync(fileSql, "CREATE TABLE " + arrEntity.text + "{\n", function(err) {
            if(err)
                throw err;
        })
    }
};

module.exports = methods;