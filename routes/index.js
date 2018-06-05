var path = require('path');
var express = require('express');
var router = express.Router();
var zip = require('express-zip');
var fs = require('fs');
var http = require('http');
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'editor.html'));
});

router.post('/fileupload', function(req, res, next) {
    //riceve i dati del form
    var form = new formidable.IncomingForm();

    //variabile che conterrà i dati del file
    var data;
    //variabile per salvare i file
    var zipToDown = [];
    /*Funzione per il parse del form
    * Parametri: req, oggetto richiesta, richiesta cliente
    *            function() come callback per il parse
    *            Parametri: err, errore, lancia un eccezione in caso di errore
    *                        fields, campi del form ricevuto
    *                        files, file caricato
    *                       */
    form.parse(req, function(err, fields, files) {
        if(err)
            res.end("Errore nel parse del form");
        /*Funzione per il parse del file json
        * Parametri: fs.readFileSync() per la lettura sincrona del file
        *            Parametri: files.filetoupload.name, nome del file da leggere
        *                       */
        data = JSON.parse(fs.readFileSync(files.filetoupload.name));
        //ciclo per suddividere le entità all'interno delle cells

        while(data.cells.length > 0) {
            var arrEntity = data.cells.shift();
            //Per ogni entità devo:
            //richiesta dei moduli per creare i file
            var fileJava = require('../functions/filejavaname.js')(arrEntity.attrs.label);
            var fileSql = require('../functions/filesqlname')(arrEntity.attrs.label);
            //moduli per scrivere l'intestazione;
            require('../functions/writeintestfile.js').WriteIntJava(fileJava, arrEntity.attrs.label);
            require('../functions/writeintestfile.js').WriteIntSql(fileSql, arrEntity.attrs.label);
            //scrivere gli attributi
            var attribute = "/*ATTRIBUTI*/ \n";
            var settot = "/*METODI SET*/ \n";
            var gettot = "/*METODI GET*/ \n";
            var attributeSql = '';
            //ciclo per suddividere gli attributi
            while(arrEntity.attrs.attributi.length > 0) {
                //variabile per eliminare l'ulitma virgola nel file sql
                var last = false;
                var arrAttr = arrEntity.attrs.attributi.shift();
                if(arrEntity.attrs.attributi.length == 0)
                    last = true;
                attribute += require('../functions/writeattribute.js').WriteAttributeJava(arrAttr);
                settot += require('../functions/writeattribute.js').WriteSetJava(arrAttr);
                gettot += require('../functions/writeattribute.js').WriteGetJava(arrAttr);
                attributeSql += require('../functions/writeattribute.js').WriteAttributeSql(arrAttr, last);
            }
            require('../functions/writeattribute.js').WriteAllJava(fileJava, attribute, settot, gettot);
            require('../functions/writeattribute.js').WriteAllSql(fileSql, attributeSql);
            //aggiungere i file per la zip
            zipToDown.push({path: './' + fileJava, name: fileJava}, {path: './' + fileSql, name: fileSql});
        }
        if(data.cells.length == 0) {
            //modulo per la creazione della zip
            res.zip(zipToDown, 'Project_IronWorks.zip');
        }
    });
    
});

module.exports = router;
