/*
 Juego de batalla distribuido
 Cliente de modo texto.
 Copyright (C) 2013-2016 por Ariel Ortiz

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

//------------------------------------------------------------------------------
const stringify   = require('querystring').stringify;
const promisify   = require('./helpers/promisify');
const request     = promisify(require('request'));
//------------------------------------------------------------------------------
const stdin       = process.stdin;
const stdout      = process.stdout;
const PAUSA       = 5000; // Milisegundos entre cada petición de espera
const numtablerorow  = [1,2,3,4,5,6,7,8,9,10];
const lettertablerorow  = [' A ',' B ',' C ',' D ',' E ',' F ',' G ',' H ',' I ',' J '];
const ships = [
                {name:"CARRIER",size: 5},
                {name:"BATTLESHIP",size:4},
                {name:"CRUISER",size:3},
                {name:"SUBMARINE",size:3},
                {name:"DESTROYER",size:2}
              ];
let invocar;
let ID_GAME;

//------------------------------------------------------------------------------
// Creador de objetos para invocar servicios web.

function invocadorServicioWeb(host) {

  let cookiesSesion = null;

  //----------------------------------------------------------------------------
  function obtenerCookies(res) {
    let valorSetCookies = res.headers['set-cookie'];
    if (valorSetCookies) {
      let cookies = [];
      valorSetCookies.forEach(str => cookies.push(/([^=]+=[^;]+);/.exec(str)[1]));
      cookiesSesion = cookies.join('; ');
    }
  }

  //----------------------------------------------------------------------------
  function encabezados(metodo) {
    let r = {};
    if (metodo !== 'GET') {
      r['Content-type'] = 'application/x-www-form-urlencoded';
    }
    if (cookiesSesion) {
      r['Cookie'] = cookiesSesion;
    }
    return r;
  }

  return {

    //--------------------------------------------------------------------------
    invocar: (metodo, ruta, params, callback) => {
      
      let opciones = {
        url: host + ruta,
        method: metodo,
        headers: encabezados(metodo)
      };
      let qs = stringify(params);
      if (metodo === 'GET' && qs !== '') {
        opciones.url += '?' + qs;
      } else {
        opciones.body = qs;
        
      }
      request(opciones).then(([res, body]) => {
        //console.log(res);
        if (res.statusCode !== 200) {
          callback('Error: Non OK status code (' + res.statusCode + ')');
        } else {
          obtenerCookies(res);
          callback(null, JSON.parse(body));
        }
      }).catch(err => {
        errorFatal(err);
      });
    }
  };
}

//------------------------------------------------------------------------------
function crearJuego() {
  imprimirNl();
  imprimir('Indica el nombre del juego: ');
  stdin.once('data', data => {
    let name = data.toString().trim();
    if (name === '') {
      menu();
    } else {
      invocar('POST', '/batalla/crear_juego/', {'nombre': name}).then(
        ([resultado]) => {
          if (resultado.creado) {
            ID_GAME=resultado.id;
            imprimirNl();
            imprimirNl('Juego creado exitosamente!');
            iniciarNavios();//jugar();
          } else if (resultado.codigo === 'duplicado') {
            imprimirNl();
            imprimirNl('Error: Alguien más ya creó un juego con este ' +
                      'nombre: ' + name);
            menu();
          } else {
            imprimirNl();
            imprimirNl('No se proporcionó un nombre de juego válido.');
            menu();
          }
          //menu();
        }
      );
    }
  });
}

//------------------------------------------------------------------------------
function errorFatal(mensaje) {
  imprimirNl(mensaje.toString());
  process.exit(1);
}

//------------------------------------------------------------------------------
function esperarTurno(callback) {
  invocar('GET', '/batalla/estado/', {}).then(([resultado]) => {
    //console.log('estado', resultado.estado);
    if (resultado.estado === 'espera') {
      setTimeout(() => esperarTurno(callback), PAUSA);
    } else {
      imprimirNl();
      callback(resultado);
    }
  });
}

//------------------------------------------------------------------------------
function imprimir(mens) {
  if (mens !== undefined) {
    stdout.write(mens);
  }
}

//------------------------------------------------------------------------------
function imprimirMenu() {
  imprimirNl();
  imprimirNl('================');
  imprimirNl(' MENÚ PRINCIPAL');
  imprimirNl('================');
  imprimirNl('(1) Crear un nuevo juego');
  imprimirNl('(2) Unirse a un juego existente');
  imprimirNl('(3) Salir');
  imprimirNl();
}

//------------------------------------------------------------------------------
function imprimirNl(mens) {
  if (mens !== undefined) {
    stdout.write(mens);
  }
  stdout.write('\n');
}


//------------------------------------------------------------------------------

function iniciarNavios(){


            function shipreader(i,callback){
                      if(i < ships.length){
                      leerCoordBarco(ships[i], function(respuesta){
                        console.log('respuesta callback', respuesta);

                      invocar('PUT', '/batalla/colocarBarco/',
                        { ind:respuesta.index,or:respuesta.orient,bl:respuesta.blocks }).then(
                        ([resultado]) => {
                          if (resultado.colocado) {
                            imprimirTablero(resultado.tablero);
                            shipreader(i+1,callback);
                          }
                        }).catch(function(err){
                          console.log("POSICIÓN OCUPADA");
                          shipreader(i,callback);
                        });

                      });
                      }
                      else{
                        callback(null);
                      }

            }

            shipreader(0,function(err){
            
            invocar('PUT','/batalla/pready/',{id_juego:ID_GAME}).then(([res])=>{
                console.log(res);
            });
            if(err) throw err;
            jugar();
            }
            );



}

function leerCoordBarco(ship, callback){
      let question = "Por favor inserta orientacion (H / V) seguida de una coma(,)la coordenada \n " +
                  "a colocar de "+ship.name+" de tamano "+ship.size +" bloques: \n";
     imprimirNl(question);


   stdin.once('data', data => {

    let input = data.toString().trim().split('');
     console.log('input', input);
              let orientation = input[0];
              if((orientation !== 'H' && orientation !== 'V') || input[1] !== ','){
                console.log('error de formato');
                leerCoordBarco(ship, callback);
              }
              else{
                let coord = input[2]+input[3];
                let validcoord = validarCoordenada(coord);
                if (validcoord === null){
                    leerCoordBarco(ship, callback)
                }
                else{
                    let valid = validarDimension(validcoord, orientation, ship.size);
                    (!valid) ? leerCoordBarco(ship, callback) :callback(valid);
                }
              }

  });



  }


//------------------------------------------------------------------------------


function validarDimension (coordenada, orientacion, tamano){
  //console.log('entrando a validar');
  let splt = coordenada.split('');
  let x  = parseInt(numeroDeLetra(splt[0]));
  let y = parseInt(splt[1]);
  let res = true;
  let sumx = x + parseInt(tamano) -1;
  let sumy = y + parseInt(tamano) -1;
  let finalarray = [];
  if(orientacion === 'H') {

      if(sumy > 9)
      {
        console.log('Tiro Inválido en Horizontal');
        res = false;
        return null;
      }

      else{
        
        for(let i = y; i <= sumy; i++){
          finalarray.push(i);
        }
        let response = {
          index : x,
          blocks : finalarray,
          orient : "hor"
        }
        return response;
      }
      
  }
  else if(orientacion === 'V'){
      if(sumx > 9){
        console.log('Tiro inválido en vertical');
        res= false;
        return null;
      }

      else{
        let finalarray = [];
        for(let i = x; i <= sumx; i++){
          finalarray.push(i);
        }
        let response = {
          index : y,
          blocks : finalarray,
          orient : "ver"
        }
        
        return response;
      }
      
  }

  
}
  
 
//------------------------------------------------------------------------------
function imprimirTablero(t) {
    //imprimirNl(lettertablerorow.join(' ').toString());
    for(let i=0;i<10;i++){
      imprimirNl(lettertablerorow[i] + ' | ' + t[i].join(' | ') + (' | '));
      imprimirNl('----|---|---|---|---|---|---|---|---|---|---|');
    }
    //imprimirNl(lettertablerorow.join(' ').toString());
  
}

//------------------------------------------------------------------------------
function juegoTerminado(estado) {

  function mens(s) {
    imprimirNl();
    imprimirNl(s);
    return true;
  }

  switch (estado) {
  case 'empate':
    return mens('Empate.');
  case 'ganaste':
    return mens('Ganaste. ¡Felicidades!');
  case 'perdiste':
    return mens('Perdiste. ¡Lástima!');
  default:
    return false;
  }
}

function numeroDeLetra(letra){
    for(let j = 0; j < lettertablerorow.length; j++){
            if(letra.toUpperCase()===lettertablerorow[j].trim()){
              return j.toString();
            }
          }
}

//------------------------------------------------------------------------------
function jugar() {
  imprimirNl();
  imprimirNl('Un momento');
  esperarTurno(resultado => {

    //--------------------------------------------------------------------------
    function tiroEfectuado(tablero) {
      imprimirNl('*****TUS TIROS ACERTADOS SE MARCAN CON UNA X*****');
      imprimirNl('*****TUS TIROS FALLADOS SE MARCAN CON UNA W*****');
      imprimirTablero(tablero);
      jugar();
      
    }

    //--------------------------------------------------------------------------
    function tiroNoEfectuado() {
      imprimirNl();
      imprimirNl('ERROR: Tiro inválido.');
      jugar();
    }
    //--------------------------------------------------------------------------

    imprimirNl('******TUS BARCOS SE MARCAN CON Z*****');
    imprimirNl('*****LOS TIROS ACERTADOS DEL CONTRINCANTE SE MARCAN CON UNA X*****');
    imprimirNl('*****LOS TIROS FALLADOS DEL CONTRINCANTE SE MARCAN CON UNA W*****');
    imprimirTablero(resultado.tablero[0]);
    if (juegoTerminado(resultado.estado)) {
      menu();
    } else if (resultado.estado === 'tu_turno') {
      imprimirNl();
      imprimirNl('Es Tu Turno ');
      imprimirNl();
      leerCoordenada(function(result){
          let coords = result.split('');
          coords[0] = numeroDeLetra(coords[0]);          
          invocar('PUT', '/batalla/tirar/', 
          { x: coords[0], y: coords[1] }).then(
          ([resultado]) => {
            if (resultado.efectuado) {
              tiroEfectuado(resultado.tablero);
            } else {
              tiroNoEfectuado();
            }
          });
    
          //console.log('LETTER TO NUMBER', coords[0]);
          //console.log('NUMBER', coords[1]);
      });
        
    }
  });
}

//------------------------------------------------------------------------------
function leerCoordenada(callback) {
  let formatedcoord =[];
  console.log('Introduce una coordenada');
  stdin.once('data', data => {
    let coord = validarCoordenada(data.toString());
    if(coord === null){
      leerCoordenada(callback);
    }
    else{
      callback(coord);
    }

  });
}

function validarCoordenada (coordenada){
  let coord = coordenada.split('');
  let formatedcoord = [];
    formatedcoord.push(coord[0]);
    formatedcoord.push(coord[1]);
    

    if(formatedcoord.length !== 2){  // \r \n
      console.log('coordenada no válida, deben ser dos dígitos');
      return null;
    }

    else{

        for(let i = 0; i < lettertablerorow.length; i++){
          if(coord[0].toUpperCase()===lettertablerorow[i].trim() && !isNaN(coord[1])){
              //console.log('Letra', coord[0]);
              //console.log('Numero', coord[1]);
              //callback(coord[0]+coord[1]);
              return coord[0]+coord[1];
          }
        }

        console.log('coordenada no válida, debe ser letra (A-J) seguida de número (0-9)');
        return null;
        
    
    }
}

//------------------------------------------------------------------------------
function leerNumero(inicio, fin, callback) {
  imprimir('Selecciona una opción del ' + inicio + ' al ' + fin + ': ');
  stdin.once('data', data => {
    let numeroValido = false;
    let num;
    data = data.toString().trim();
    if (/^\d+$/.test(data)) {
      num = parseInt(data);
      if (inicio <= num && num <= fin) {
        numeroValido = true;
      }
    }
    if (numeroValido) {
      callback(num);
    } else {
      leerNumero(inicio, fin, callback);
    }
  });
}

//------------------------------------------------------------------------------
function licencia() {
  console.log('Este programa es software libre: usted puede redistribuirlo y/o');
  console.log('modificarlo bajo los términos de la Licencia Pública General GNU');
  console.log('versión 3 o posterior.');
  console.log('Este programa se distribuye sin garantía alguna.');
}

//------------------------------------------------------------------------------
function menu() {
  imprimirMenu();
  leerNumero(1, 3, opcion => {
    switch (opcion) {
    case 1:
      crearJuego();
      break;
    case 2:
      unirJuego();
      break;
    case 3:
      process.exit(0);
    }
  });
}

//------------------------------------------------------------------------------
function seleccionarJuegosDisponibles(juegos, callback) {
  let total = juegos.length + 1;
  imprimirNl();
  imprimirNl('¿A qué juego deseas unirte?');
  for (let i = 1; i < total; i++) {
    imprimirNl('    (' + i + ') «' + juegos[i - 1].nombre + '»');
  }
  imprimirNl('    (' + total + ') Regresar al menú principal');
  leerNumero(1, total, opcion => callback(opcion === total ? -1 : opcion - 1));
}

//------------------------------------------------------------------------------
function titulo() {
  imprimirNl('Juego de batalla distribuido');
  imprimirNl('© 2016 por Ariel Ortiz, Farid Hajnal, Mario Torres (ITESM CEM)');
}

//------------------------------------------------------------------------------
function unirJuego() {
  invocar('GET', '/batalla/juegos_existentes/', {}).then(([juegos]) => {
    if (juegos.length === 0) {
      imprimirNl();
      imprimirNl('No hay juegos disponibles.');
      menu();
    } else {
      seleccionarJuegosDisponibles(juegos, opcion => {
        if (opcion === -1) {
          menu();
        } else {
          invocar('PUT', '/batalla/unir_juego/', 
            { id_juego: juegos[opcion].id }).then(
            ([resultado]) => {
              if (resultado.unido) {
                ID_GAME=resultado.id;
                console.log('tu rol es', resultado.rol)
                console.log('te has unido al juego', juegos[opcion].nombre)
                iniciarNavios(); //jugar();
              } else {
                imprimirNl();
                imprimirNl('No es posible unirse a ese juego.');
                menu();
              }
            }
          );
        }
      });
    }
  });
}

//------------------------------------------------------------------------------

titulo();
imprimirNl();
licencia();

if (process.argv.length !== 3) {
  imprimirNl();
  imprimirNl('Se debe indicar: http://<nombre de host>:<puerto>');
  process.exit(0);

} else {
  invocar = promisify(invocadorServicioWeb(process.argv[2]), 'invocar');
  menu();
}
