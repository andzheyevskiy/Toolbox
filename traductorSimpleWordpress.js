class TraductorWP {
    constructor(elementos) {
        this.elementos = elementos;
        this.dom = [];
        this.#init();
    }

    // metodo privado// compatibilidad de navegadores de 95%. Si algo sale mal refactorizar a _init()
    #init() {
        if (!Array.isArray(this.elementos)) {
            throw new Error("El argumento 'elementos' tiene que ser un Array de strings");
        } else {
            this.elementos.forEach(e => {
                if(typeof e !== "string") throw new Error("El argumento 'elementos' tiene que ser un Array de strings");
                this.dom.push(...document.querySelectorAll(e));
            })
        }
    }

    traducir(original, nuevo) {
        if (typeof original != "string" || typeof nuevo != "string") {
            throw new Error("Argumentos 'original' y 'nuevo' tienen que ser string");
        } else {
            this.dom.forEach(e=>{
                if(e.textContent.trim().toLowerCase() === original.trim().toLowerCase()) e.textContent = nuevo;
            })
        }
    }
}


//======== USO ========//
// Añadir este js a <head> con defer

 const elementosATraducir = ["h1","h2","h3", "h4", "h5", "p", "span"]; // meter o quitar elementos HTML objetivo, admite cualquier selector CSS
 const traductor = new TraductorWP(elementosATraducir); // NO TOCAR


// Aqui meteis los textos a traducir.
// traductor.traducir(texto original, texto traducido)
// texto original es insensitivo
traductor.traducir("hello world", "Hola Mundo");