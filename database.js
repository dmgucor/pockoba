var previous = true;
setInterval(function () {
    var ifConnected = window.navigator.onLine;
    if (ifConnected) {
        if (ifConnected !== previous) { connectionAlert(); }
        previous = ifConnected;
    } else {
        previous = ifConnected;
    }
}, 3000);

const dbName = "kobaDB";
var request = indexedDB.open(dbName, 2);
var db;

request.onerror = function (event) {
    alert("Database error: " + event.target.errorCode);
};
 
request.onsuccess = function (evt) {
    db = this.result;
    console.log("openDb DONE");
};

request.onupgradeneeded = function (event) {
    db = event.target.result;


    var objectStore = db.createObjectStore("traslados", { autoIncrement: true });

    objectStore.createIndex("producto", "producto", { unique: false });
    objectStore.createIndex("cantidad", "cantidad", { unique: false });
    objectStore.createIndex("destinatario", "destinatario", { unique: false });
    objectStore.createIndex("fecha", "fecha", { unique: false });
    objectStore.createIndex("motivo", "motivo", { unique: false });    

};

function getRadioButton() {
    var elementos = document.getElementsByName('optradio');
    for (i = 0; i < elementos.length; i++) {
        if (elementos[i].checked)
            return elementos[i].value;
    }
};

function agregarRegistro() {console.log(window.navigator.onLine);
    if (!window.navigator.onLine) {
        var producto = document.getElementById("producto").value; console.log(producto);
        var cantidad = document.getElementById("cantidad").value; console.log(cantidad);
        var destinatario = getRadioButton(); console.log(destinatario);

        var fecha = document.getElementById("fecha").value; console.log(fecha);
        var motivo = document.getElementById("motivo").value; console.log(motivo);

        var obj = {
            producto: producto, cantidad: cantidad, destinatario: destinatario, fecha: fecha, motivo: motivo
        };

        var transaction = db.transaction(["traslados"], "readwrite");
        var objectStore = transaction.objectStore("traslados");

        var req;
        try {
            req = objectStore.add(obj);
        } catch (e) {
            console.log("error " + e.errorCode);
            throw e;
        }

        req.onsuccess = function (evt) {
            alert("Se ha agregado el registro.");
        }

        req.onerror = function () {
            console.error("error al agregar el traslado :(", this.error);
        }
    }
};

function connectionAlert() {

    var transaction = db.transaction(["traslados"], "readwrite");
    var objectStore = transaction.objectStore("traslados");
    var trans = "Se enviarán los siguientes datos recuperados mientras no había conexión:\n";
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log(cursor.value.producto);
            trans += "producto: " + cursor.value.producto + ", cantidad: " + cursor.value.cantidad + "\n";

            cursor.continue();
        }
        else {
            alert(trans);
            objectStore.clear();
        }
    }


};



