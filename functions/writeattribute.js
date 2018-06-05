/*File: writeattribute.js
Versione: v0.1
Autore: Mirko Gibin
Registro Modifiche: Mirko Gibin, scrittura metodi
*/

/*Questo file mette a disposizione dei moduli per creare gli attributi nei file java e sql
* ogni metodo raccolto nell'array methods può esserer richiamato all'esterno
* con una require */
var fs = require('fs');
var methods = {
    WriteAttributeJava: function(arrAttr) {
        return "\t" + arrAttr.accesso + " " + arrAttr.tipo + " " + arrAttr.nome + ";\n";
    },
    WriteSetJava: function(arrAttr) {
        return "\tvoid set" + arrAttr.nome + "(" + arrAttr.tipo + " val) {\n \t \t" + arrAttr.nome + " = val;\n\t} \n";
    },
    WriteGetJava: function(arrAttr) {
        return "\t" + arrAttr.tipo + " get" + arrAttr.nome + "() { \n \t \t return " + arrAttr.nome + ";\n\t} \n";
    },
    WriteAttributeSql: function(arrAttr, last) {
        var tip = '';
        switch(arrAttr.tipo) {
            case "String":
                tip += "CHAR(256)";
                break;
            case "int":
            case "double":
            case "float":
                tip += "NUMERIC(3,0)";
                break;
            case "boolean":
                tip += "BIT";
                break;
            case "Date":
                tip += "DATE";
                break;
            //caso degli array da fare
            default:
                tip += "da decidere i tipi";
                break;
        }
        if(last) {
            console.log("sono alla fine " + arrAttr.nome);
            return arrAttr.nome + " " + tip + "\n";
        }
        else {
            return arrAttr.nome + " " + tip + ",\n";
        }

    },
    WriteAllJava: function(fileJava, attribute, settot, gettot) {
        fs.appendFileSync(fileJava, attribute + settot + gettot + "\n}", function(err) {
            if(err)
                throw err;
        })
    },
    WriteAllSql: function(fileSql, attributeSql) {
        fs.appendFileSync(fileSql, attributeSql + "}", function(err) {
            if(err)
                throw err;
        })
    }
};
module.exports = methods;