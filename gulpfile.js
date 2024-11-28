/*Funciones en JavaScript*/
//Compilar sass
    /**PASOS
      1- Identificar archivo ( src('src/scss/app.scss') )
      2- Compilarla 
      3- Guardar el .css
      */

//dest es para el destino de la hoja de estilos compilada
//Series: Se inicia la primera tarea y cuando finaliza, hace la siguiente tarea
//Paralell: Todas inician al mismo tiempo

//Las vulnerabilidades estan en node_modules pero nosotros no vamos a subir nada de eso, por lo que no hay que preocuparse

const { src, dest, watch, series, parallel } = require('gulp'); //Esta importando gulp del pacquete json, si hay {} es que importa varias funciones

//Dependencias de CSS y SASS
const sass = require('gulp-sass')(require('sass')); //Solo importa una función (en este caso compilar la hoja de estilos)
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano'); //Para minificar y hacer que la hoja de estilos pese menos

//Dependencias de imágenes
const imagemin = require('gulp-imagemin'); //Hace que las imagenes pesen menos
const webp = require('gulp-webp'); //Formato webp para las imagenes
const avif = require('gulp-avif'); //Formato avif para las imagenes

function css(done){
    
    src('src/scss/app.scss') //Identifico la hoja de estilos
        .pipe( sourcemaps.init() ) //Esto es para ubicarlo. Inicia sourcemaps
        .pipe(sass()) //Compila mi hoja de estilos
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe( sourcemaps.write('.'))//Esto es donde quiero que se guarde, en este caso al lado del build
        .pipe(dest('build/css')) //Guardar pq sino me lo va a borrar
        //El output me da la opcion de como quiero que se vea mi app.css (me sirve para hacer que pese menos)

    done();
}

function imagenes(){ //Si pones un return, no te hace falta poner done
    return src('src/img/**/*') // (*) quiere decir que da igual el formato
        .pipe( imagemin({ optimizationLevel: 3})) //Hace que las imagenes pesen menos
        .pipe(dest('build/img'));
}

function versionWebp(){
    const opciones = { //Esto es para refucir al 50% la calidad
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')//Las .svg son muy ligeras, no hace falta pasarlas a webp. Solo transforma las png y las jpg
        .pipe( webp( opciones ))
        .pipe(dest('build/img'));
}

function versionAvif(){
    const opciones = { //Esto es
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')//Las .svg son muy ligeras, no hace falta pasarlas a webp. Solo transforma las png y las jpg
        .pipe( avif( opciones ) )
        .pipe(dest('build/img'));
}

//WATCH: Para que me lo guarde los cambios sin tener que compilarlo otra vez
function dev(){
    //1. A que tengo que prestarle atención ('src/scss/app.scss')
    //2. Que funcion es la que va a ejecutar (css)
    watch('src/scss/**/*.scss', css); //Los ** me buscan cualquier archivo y el * busca todos los archivos que tengan la extension .scss
    //watch('src/scss/app.scss', css); Esta linea se va a compilar tambien arriba por lo que no es necesario
    watch('src/img/**/*', imagenes); //Si se agregan o se quitan imagenes, llamamos a la tarea imagenes
}

//Las tarea por default sirven para hacer varias cosas al mismo tiempo
// function tareaDefault(){
//     console.log('Soy la tarea por default');
// }

/*Esto va a ser ejecutado por Gulp*/
exports.css = css;
exports.dev = dev; //Para pararlo hacer ctrl + C
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev); //Dejar la tarea de watch al final