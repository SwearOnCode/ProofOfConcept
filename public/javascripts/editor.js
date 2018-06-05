/* Variabili globali per la generazione del diagramma vuoto al caricamento della pagina */

//Variabile per la creazione del diagramma relativo all'editor
var graph = new joint.dia.Graph;

//Variabile per la creazione del foglio contenente l'editor
var paper = new joint.dia.Paper({
    //Collego il foglio all'elemento corretto della struttura HTML, e aggiungo il diagramma correlato
    el: $('#editor'),
    model: graph,
    //Dimensioni del foglio
    width: 900,
    height: 700,
    //Opzioni per visualizzare la griglia del foglio, ed imporre la dimensione minima di spostamento degli elementi in essa
    gridSize: 10,
    drawGrid: true,
    //Colore di sfondo del foglio
    background: {
        color: '#dff2fa'
    },
    //Rendo il foglio interattivo ai comandi utente
    interactive: true
});

//Variabile per la creazione del diagramma relativo agli elementi
var graph1 = new joint.dia.Graph;

//Variabile per la creazione del foglio contenente gli elementi
var paper1 = new joint.dia.Paper({
    //Collego il foglio all'elemento corretto della struttura HTML, e aggiungo il diagramma correlato
    el: $('#elements'),
    model: graph1,
    //Dimensioni del foglio
    width: 130,
    height: 700,
    //Colore di sfondo del foglio
    background: {
        color: '#FFFFFF'
    },
    interactive: false
});

//Definisco gli elementi da inserire nel diagramma contenente gli elementi
var color = 'none';

var actor = new joint.shapes.standard.Image();
actor.resize(46, 91); //equal to size of SVG
actor.position(50, 20);
actor.attr('label/text', 'Actor');
actor.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="46px" height="91px">\n    <g transform="translate(0.5,0.5)">\n        <ellipse cx="22.25" cy="11.5" rx="11.25" ry="11.25" fill="' + color + '" stroke="#000000" pointer-events="none"/>\n        <path d="M 22.5 22.5 L 22.5 60 M 22.5 30 L 0 30 M 22.5 30 L 45 30 M 22.5 60 L 0 90 M 22.5 60 L 45 90" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n    </g>\n</svg>'));

var boundary = new joint.shapes.standard.Image();
boundary.resize(98, 81); //equal to size of SVG
boundary.position(20, 210);
boundary.attr('label/text', 'Boundary');
boundary.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="98px" height="81px">\n    <g transform="translate(0.5,0.5)">\n        <path d="M 0 20 L 0 60" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n        <path d="M 0 40 L 16.67 40" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n        <ellipse cx="57" cy="40" rx="40" ry="40" fill="' + color + '" stroke="#000000" pointer-events="none"/>\n    </g>\n</svg>'));

var control = new joint.shapes.standard.Image();
control.resize(81, 92); //equal to size of SVG
control.position(30, 380);
control.attr('label/text', 'Control');
control.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="81px" height="92px">\n    <g transform="translate(0.5,0.5)">\n        <path d="M 29.63 12.38 L 49.38 0" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n        <ellipse cx="40" cy="51" rx="39.5" ry="39.375" fill="' + color + '" stroke="#000000" pointer-events="none"/>\n        <path d="M 29.63 12.38 L 49.38 22.5" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n    </g>\n</svg>'));

var entity = new joint.shapes.standard.Image();
entity.resize(81, 81); //equal to size of SVG
entity.position(30, 570);
entity.attr('label/text', 'Entity');
entity.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="81px" height="81px">\n    <g transform="translate(0.5,0.5)">\n        <ellipse cx="40" cy="40" rx="40" ry="40" fill="' + color + '" stroke="#000000" pointer-events="none"/>\n        <path d="M 10 80 L 70 80" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n    </g>\n</svg>'));

var link = new joint.dia.Link();
link.source({x: 120, y: 444});
link.target({x: 200, y: 511});

graph1.addCells([actor, boundary, control, entity]);


/* Eventi impostati al caricamento della pagina */

//DRag and drop : la freccia fa casini
paper1.on('cell:pointerdown', function(cellView, e, x, y) {
    $('body').append('<div id="invisiblePaper" style="position:fixed;z-index:100;opacity:.2;pointer-event:none;"></div>');

    //creo il graph del "invisibile" che serve per spostare gli elementi da un paper all'altro
    var invisibleGraph = new joint.dia.Graph;
    var invisiblePaper = new joint.dia.Paper({
        el: document.getElementById('invisiblePaper'),
        model: invisibleGraph,
        interactive: false,
        height: 113,
        width: 100
    });
    // faccio la clone dell'elemento che voglio spostare
    var invisibleShape = cellView.model.clone();
    //salvo la posizione
    var pos = cellView.model.position();
    var offset = {
        x: x - pos.x,
        y: y - pos.y
    };

    // aggiungo nel paper invisibile la copia dell'elemento
    invisibleShape.position(0, 0);
    invisibleGraph.addCell(invisibleShape);
    //cambio la posizione del paper invisibile
    $('#invisiblePaper').offset({
        left: e.pageX - offset.x,
        top: e.pageY - offset.y
    });


    //quando muovo il mouse muovo anche il paper invisibile e il suo contenuto
    $('body').on('mousemove.inv', function(e) {
        $('#invisiblePaper').offset({
            left: e.pageX - offset.x,
            top: e.pageY - offset.y
        });
    });
    // al mouse up il mio elemento si sistema
    $('body').on('mouseup.inv', function(e) {
        var x = e.pageX;
        var y = e.pageY;
        var target = paper.$el.offset();

        // se è dentro il foglio allora faccio la copia dell'elemento invisibile e lo piazzo dove voglio
        if(x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
            var c = invisibleShape.clone();
            var color = 'none';
            var tmp = c.attr('label/text');
            if(tmp == 'Actor') {
                if(document.getElementById('actorNoColor').checked === false)
                    var color = document.getElementById('actorColor').value;
                c.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="46px" height="91px">\n    <g transform="translate(0.5,0.5)">\n        <ellipse cx="22.25" cy="11.5" rx="11.25" ry="11.25" fill="' + color + '" stroke="#000000" pointer-events="none"/>\n        <path d="M 22.5 22.5 L 22.5 60 M 22.5 30 L 0 30 M 22.5 30 L 45 30 M 22.5 60 L 0 90 M 22.5 60 L 45 90" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n    </g>\n</svg>'));
                var name = document.getElementById('actorName').value;
                if(name !== '') {
                    c.attr('label/text', name);
                }
                else {
                    c.attr('label/text', 'Actor');
                }
            } else if(tmp == 'Boundary') {
                if(document.getElementById('boundaryNoColor').checked === false)
                    var color = document.getElementById('boundaryColor').value;
                c.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="98px" height="81px">\n    <g transform="translate(0.5,0.5)">\n        <path d="M 0 20 L 0 60" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n        <path d="M 0 40 L 16.67 40" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n        <ellipse cx="57" cy="40" rx="40" ry="40" fill="' + color + '" stroke="#000000" pointer-events="none"/>\n    </g>\n</svg>'));
                var name = document.getElementById('boundaryName').value;
                if(name !== '') {
                    c.attr('label/text', name);
                }
                else {
                    c.attr('label/text', 'Boundary');
                }
            } else if(tmp == 'Control') {
                if(document.getElementById('controlNoColor').checked === false)
                    var color = document.getElementById('controlColor').value;
                c.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="81px" height="92px">\n    <g transform="translate(0.5,0.5)">\n        <path d="M 29.63 12.38 L 49.38 0" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n        <ellipse cx="40" cy="51" rx="39.5" ry="39.375" fill="' + color + '" stroke="#000000" pointer-events="none"/>\n        <path d="M 29.63 12.38 L 49.38 22.5" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n    </g>\n</svg>'));
                var name = document.getElementById('controlName').value;
                if(name !== '') {
                    c.attr('label/text', name);
                }
                else {
                    c.attr('label/text', 'Control');
                }
            } else if(tmp == 'Entity') {
                if(document.getElementById('entityNoColor').checked === false)
                    var color = document.getElementById('entityColor').value;
                c.attr('image/xlinkHref', 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="81px" height="81px">\n    <g transform="translate(0.5,0.5)">\n        <ellipse cx="40" cy="40" rx="40" ry="40" fill="' + color + '" stroke="#000000" pointer-events="none"/>\n        <path d="M 10 80 L 70 80" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/>\n    </g>\n</svg>'));
                var name = document.getElementById('entityName').value;
                if(name !== '') {
                    c.attr('label/text', name);
                }
                else {
                    c.attr('label/text', 'Entity');
                }
            }
            c.position(x - target.left - offset.x, y - target.top - offset.y);
            graph.addCell(c);
            //ripristino valori di default degli elementi dopo l'inserimento
            document.getElementById('actorName').value = '';
            document.getElementById('boundaryName').value = '';
            document.getElementById('entityName').value = '';
            document.getElementById('controlName').value = '';
            document.getElementById('actorColor').value = '#000000';
            document.getElementById('boundaryColor').value = '#000000';
            document.getElementById('entityColor').value = '#000000';
            document.getElementById('controlColor').value = '#000000';
            document.getElementById('actorNoColor').checked = true;
            document.getElementById('boundaryNoColor').checked = true;
            document.getElementById('entityNoColor').checked = true;
            document.getElementById('controlNoColor').checked = true;
        }

        //cancello quello che ho creato
        $('body').off('mousemove.inv').off('mouseup.inv');
        invisibleShape.remove();
        $('#invisiblePaper').remove();
    });
});

//Imposto all'evento double-clicked la rimozione dell'elemento
paper.on('cell:pointerdblclick', function(cellView) {
    if(confirm('Are you sure you want to delete this element?'))
        cellView.remove();
});

//Imposto all'evento "mouse-wheel con scroll del mouse nel DOM" (ovvero all'uso della rotellina del mouse per fare scroll e non quando la si preme...)
//Tale evento è collegato solo all'oggetto "paper", ed effettua una chiamata di funzione che si occupa dello zoom
//Nota: "DOMMouseScroll" serve per il browser "Mozilla Firefox"
paper.$el.on('mousewheel DOMMouseScroll', function(event) {
    //Resetto e reimposto l'evento originale, necessario per eseguire correttamente gli eventi "mouse-wheel" e "DOMMouseScroll"
    event.preventDefault();
    event = event.originalEvent;

    //Variabile che definisce lo "step di zoom" ad ogni scatto della rotellina del mouse
    var step = 50;
    //Variabile che calcola il valore corrispondente a quanto la rotellina del mouse è stata girata
    //Nota1: "event.wheelDelta" serve per il browser "Mozilla Firefox"
    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail))) / step;

    /*
    Calcolo l'offset delle coordinate "X" e "Y":
    - Relativamente all'oggetto contenente il "paper";
    - Oppure calcolate come differenza fra le coordinate assolute della finestra meno le coordinate attuali del puntatore del mouse.
    */
    var offsetX = (event.offsetX || event.clientX - $(this).offset().left);
    var offsetY = (event.offsetY || event.clientY - $(this).offset().top);

    //Variabile del punto dello schermo indicante la nuova posizione basata sugli "offset" calcolati
    var point = offsetToLocalPoint(offsetX, offsetY);

    //Variabile contente di quanto il "paper" deve essere "scalato" (livello di zoom)
    var newScale = V(paper.viewport).scale().sx + delta;

    //Imposto un intervallo minimo di zoom in avanti e di zoom indietro
    if(newScale > 0.4 && newScale < 2) {
        //Setto le coordinate dell'origine del "paper"
        paper.setOrigin(0, 0);
        //Opero lo "scale" del "paper"
        paper.scale(newScale, newScale, point.x, point.y);
    }
});

/* Funzione che riceve come parametro le coordinate di un punto, e ritorna un punto con le medesime coordinate convertite per lo schermo */
function offsetToLocalPoint(x, y) {
    //Creo un punto con il sistema di coordinate degli SVG, basandomi sull'SVG che descrive il "paper"
    var svgPoint = paper.svg.createSVGPoint();
    //Assegno le coordinate di "X" e "Y" ricevute come parametri
    svgPoint.x = x;
    svgPoint.y = y;

    //Ritorno il punto con le coordinate assegnate convertendole da coordinate basate sul sistema degli SVG in coordinate per lo schermo
    return svgPoint.matrixTransform(paper.viewport.getCTM().inverse());
}


/* Funzione che disabilita la checkbox indicante "nessun colore" per l'elemento Attore */
function actorColorSelected() {
    document.getElementById('actorNoColor').checked = false;
}

/* Funzione che disabilita la checkbox indicante "nessun colore" per l'elemento Boundary */
function boundaryColorSelected() {
    document.getElementById('boundaryNoColor').checked = false;
}

/* Funzione che disabilita la checkbox indicante "nessun colore" per l'elemento Control */
function controlColorSelected() {
    document.getElementById('controlNoColor').checked = false;
}

/* Funzione che disabilita la checkbox indicante "nessun colore" per l'elemento Entità */
function entityColorSelected() {
    document.getElementById('entityNoColor').checked = false;
}

/* Funzione per l'aggiunta di un elemento: Linea di Associazione */
function addLine() {
    //SOLUZIONE 1:
    /*
    //Creo l'elemento
    var link = new joint.dia.Link({
        //Punto di partenza della linea
        source: { x: 10, y: 10 },
        //Punto di arrivo della linea
        target: { x: 40, y: 120 }
    });

    //Aggiungo l'elemento al diagramma
    link.addTo(graph);
    */


    //SOLUZIONE 2 [versione Alpha]:
    /*
    paper.on({'element:pointerclick': function(cellView, evt, x, y) {
            var link = new joint.dia.Link();
            link.set('source', cellView.model);
            graph.addCell(link);
            //evt.data = {link: link, x: x, y: y};
            paper.off();
        }

        //'blank:pointerclick': function(evt, x, y) {
        //    //a seconda di dove muovo la linea, essa si sposta
        //    evt.data.link.set('target', cellView.model);
        //}
    });
    */


    //SOLUZIONE 2 [versione Beta]:
    //Inizializzo due variabili per tenere traccia dell'elemento "source" della linea di associazione
    var isFirstElement = true;
    var idSourceElement = null;
    //var idTargetElement = null;

    //Aggiungo l'evento "pointerclick" all'elemento, in modo da invocare la funzione per la creazione della linea di associazione
    paper.on('cell:pointerclick', function(cellView, event) {
        //Se è l'elemento "source" (il primo) allora salvo il suo ID e aspetto che l'utente scelga l'elemento "target" (il secondo)
        if(isFirstElement) {
            idSourceElement = cellView.model.id;
            isFirstElement = false;
        }
        else {
            //idTargetElement = cellView.model.id;
            //isFirstElement = true;

            //Creo la linea di associazione che collega i due elementi indicati dall'utente
            var link = new joint.dia.Link({
                source: {id: idSourceElement},
                target: {id: cellView.model.id}
                //target: {id: idTargetElement}
            });

            //Aggiungo la linea di associazione al diagramma
            link.addTo(graph);
            //Reset dell'evento collegato al paper
            paper.off();

            //Reimposto all'evento double-clicked la rimozione dell'elemento
            paper.on('cell:pointerdblclick', function(cellView) {
                if(confirm('Are you sure you want to delete this element?'))
                    cellView.remove();
            });
        }
    });
}

/* Funzione per generare il codice a partire dal diagramma corrente */
function generateCode() {
    return; //TO DO!
}

/* Funzione per la creazione ed il download in locale del file JSON del diagramma corrente */
function saveDiagram() {
    //Aggiungo al diagramma la data attuale di esportazione
    graph.set('graphExportTime', Date.now());

    //Genero il file Object-JSON e lo converto in String-JSON
    var jsonObject = graph.toJSON();
    var jsonString = JSON.stringify(jsonObject);

    /* DA RIMUOVERE / FARE IN MODO MIGLIORE !!! */
    //Per identificare tutti e soli gli elementi "Entità" sostituisco parte del loro codice SVG con una stringa identificativa!
    jsonString = jsonString.replace(/cx%3D%2240%22/g, '___Entity_Element___');

    //Creo un Blob contenente il JSON, ed un URL che punti ad esso
    var blob = new Blob([jsonString], {type: 'application/json'});
    var url = URL.createObjectURL(blob);

    //Creo un tag HTML "<a>" per il download del file JSON
    var a = document.createElement('a');
    a.textContent = 'Download it!';
    a.href = url;
    a.download = 'graph.json';
    a.title = 'Download this JSON file: graph.json';

    //Rimuovo eventuali link creati precedentemente per il download
    var targetNode = document.getElementById('downloadJSON');
    while(targetNode.firstChild) {
        targetNode.removeChild(targetNode.firstChild);
    }

    //Aggiungo il tag per il download del JSON ad DOM
    targetNode.appendChild(a);
    a.click();
}

/* Funzione per il caricamento da locale di un file JSON di un diagramma salvato */
function loadDiagram() {
    //Controllo che il browser supporti le API degli oggetti "FileReader"
    if(typeof window.FileReader !== 'function') {
        alert('The "FileReader" API isn\'t supported on this browser yet.');
        return;
    }

    //Controllo che l'utente abbia selezionato un file da caricare, e che non ci siano stati altri problemi con tale file
    var input = document.getElementById('inputJSON');
    if(!input) {
        alert('Sorry: We couldn\'t find any input file object.');
    }
    else if(!input.files) {
        alert('This browser doesn\'t seem to support the "file" property for input file.');
    }
    else if(!input.files[0]) {
        alert('Please select a file before clicking button: "Load Diagram"');
    }
    else {
        //Variabile contenente il file caricato
        var file = input.files[0];
        //Nuovo oggetto "FileReader"
        var fileReadObj = new FileReader();
        //Setto all'evento "onload" dell'oggetto "FileReader" la chiamata alla funzione "toObjectJSON(event)"
        fileReadObj.onload = toObjectJSON;
        //Invoco il metodo "readAsText(file)" sulla variabile contenente il file caricato, invocando così la funzione collegata all'evento "onload" dell'oggetto "FileReader"
        fileReadObj.readAsText(file);
    }

    /* Funzione di supporto per l'oggetto "FileReader" */
    function toObjectJSON(event) {
        //Salvo temporaneamente in una variabile il contenuto del file caricato
        var temp = event.target.result;

        /* DA RIMUOVERE / FARE IN MODO MIGLIORE !!! */
        //Per identificare tutti e soli gli elementi "Entità" erano state sostituite parti del loro codice SVG con una stringa identificativa, ora inverto tale procedura!
        var jsonString = temp.replace(/___Entity_Element___/g, 'cx%3D%2240%22');

        //Verifico che il contenuto del file caricato sia uno "String-JSON" valido
        jsonString = validateJSON(jsonString);

        //Se è uno "String-JSON" valido lo converto in un "Object-JSON" e carico il diagramma corrispondente, altrimenti segnalo all'utente l'errore
        if(jsonString)
            graph.fromJSON(jsonString);
        else
            alert('Sorry: Uploaded input file isn\'t a valid JSON file.');
    }
}

/* Funzione che controlla che il parametro in ingresso sia uno "String-JSON", se è così lo ritorna convertito in un "Object-JSON", altrimenti ritorna "null" */
function validateJSON(jsonString) {
    //Tento la conversione da "String-JSON" a "Object-JSON", se riesco ritorno un valido "Object-JSON", altrimenti viene sollevata un'eccezione
    try {
        return JSON.parse(jsonString);
    }
        //Catturo l'eccezione in caso di conversione andata male, e ritorno "null"
    catch(exception) {
        return null;
    }
}