var previous = true;
setInterval(function () {
    var ifConnected = window.navigator.onLine;
    if (ifConnected) {
        console.log("online");
        if (ifConnected !== previous) { connectionAlert(); }
        previous = ifConnected;
    } else {
        console.log("offline");
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


    var objectStore = db.createObjectStore("translados", { autoIncrement: true });

    // Se crea un índice para buscar clientes por nombre. Se podrían tener duplicados
    // por lo que no se puede usar un índice único.
    objectStore.createIndex("producto", "producto", { unique: false });
    objectStore.createIndex("cantidad", "cantidad", { unique: false });
    objectStore.createIndex("destinatario", "destinatario", { unique: false });
    objectStore.createIndex("fecha", "fecha", { unique: false });
    objectStore.createIndex("motivo", "motivo", { unique: false });    

};

function getRadioButton() {
    var ele = document.getElementsByName('optradio');
    console.log(ele);
    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            return ele[i].value;
    }
};

function addTranslado() {
    if (!window.navigator.onLine) {
        console.log("Agregar un translado");
        var producto = document.getElementById("producto").value;
        var cantidad = document.getElementById("cantidad").value;
        var destinatario = getRadioButton();

        var fecha = document.getElementById("fecha").value;
        var motivo = document.getElementById("motivo").value;

        var obj = {
            producto: producto, cantidad: cantidad, destinatario: destinatario, fecha: fecha, motivo: motivo
        };
        console.log(obj);

        var transaction = db.transaction(["translados"], "readwrite");
        var objectStore = transaction.objectStore("translados");

        var req;
        try {
            req = objectStore.add(obj);
        } catch (e) {
            console.log("error " + e.errorCode);
            throw e;
        }

        req.onsuccess = function (evt) {
            console.log("Se ha agregado el translado a la base de datos :)");
        }

        req.onerror = function () {
            console.error("error al agregar el translado :(", this.error);
        }
    }
};

function connectionAlert() {

    var transaction = db.transaction(["translados"], "readwrite");
    var objectStore = transaction.objectStore("translados");
    var trans = "Se enviarán los siguientes datos recuperados mientras no había conexión:\n";
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log(cursor.value.producto);
            trans += "producto: " + cursor.value.producto + ", cantidad: " + cursor.value.cantidad + "\n";

            cursor.continue();
        }
        else {
            console.log("No more entries!");
            alert(trans);
            objectStore.clear();
        }
    }


};



