const dbName = "kobaDB";

const personasData = [
    { nombre: "Laura", apellido: "Perez" },
    { nombre: "Pancracio", apellido: "Casas" }
];

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

    // Se crea un almacén para contener la información de nuestros cliente
    // Se usará "ssn" como clave ya que es garantizado que es única
    var objectStore = db.createObjectStore("personas", { autoIncrement: true });

    // Se crea un índice para buscar clientes por nombre. Se podrían tener duplicados
    // por lo que no se puede usar un índice único.
    objectStore.createIndex("nombre", "nombre", { unique: false });
    objectStore.createIndex("apellido", "apellido", { unique: false });

    // Se usa transaction.oncomplete para asegurarse que la creación del almacén 
    // haya finalizado antes de añadir los datos en el.
    objectStore.transaction.oncomplete = function (event) {
        // Guarda los datos en el almacén recién creado.
        var personasObjectStore = db.transaction("personas", "readwrite").objectStore("personas");
        for (var i in personasData) {
            personasObjectStore.add(personasData[i]);
        }
    }
};

function addPerson() {
    console.log("Agregar una persona");
    var nom = document.getElementById("nameInput").value;
    var ape = document.getElementById("lastNameInput").value;
    var obj = { nombre: nom, apellido: ape }; console.log(obj);

    var transaction = db.transaction(["personas"], "readwrite");
    var objectStore = transaction.objectStore("personas");
    
        var req;
        try {
            req = objectStore.add(obj);
        } catch (e) {
            console.log("error " + e.errorCode);
            throw e;
        }

        req.onsuccess = function (evt) {
            console.log("Se ha agregado la persona a la base de datos :)");
        }

        req.onerror = function () {
            console.error("eror al agregar la pesona :(", this.error);
        }
    
};
