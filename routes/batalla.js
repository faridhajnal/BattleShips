/*******************************************************************************
 * Juego de batalla distribuido
 * Implementación de servicios web.
 * Copyright (C) 2013-2016 por Ariel Ortiz, Mario Torres & Farid Hajnal
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

'use strict';

//------------------------------------------------------------------------------
const express    = require('express');
const promisify  = require('../helpers/promisify');
const router     = express.Router();
const constantes = require('../models/constantes.js');
const Juego      = require('../models/juego.js');
const Jugador    = require('../models/jugador.js');

module.exports = router;

//------------------------------------------------------------------------------

const ABORTAR  = true;

//------------------------------------------------------------------------------
router.get('/', (req, res) => {
  res.redirect('/batalla/');
});

//------------------------------------------------------------------------------
router.get('/batalla/', (req, res) => {
  res.render('index.ejs');
});
//------------------------------------------------------------------------------
router.put('/batalla/pready/', (req, res) => {
  let resultado = { unido: false, codigo: 'id_malo' };
  let idJuego = req.body.id_juego;
  let juego;
  if (idJuego) {
    let findOne = promisify(Juego, 'findOne');
    findOne({_id: idJuego}).then(([_juego]) => {
      juego = _juego;
        juego.READY+=1;
        let save = promisify(juego, 'save');
        return save();
    }).then(_ => {
      resultado.codigo = 'bien';
      resultado.READY = juego.READY;
    }).catch(err => {
      if (err !== ABORTAR) {
        console.log(err);
      }
    }).then(_ => res.json(resultado));

  } else {
    res.json(resultado);
  }
});
//------------------------------------------------------------------------------

router.post('/batalla/crear_juego/', (req, res) => {

  let resultado = { creado: false, codigo: 'invalido' };
  let nombre = req.body.nombre;
  let juego;
  let jugador;

  if (nombre) {
    let find = promisify(Juego, 'find');
    find({ nombre: nombre, iniciado: false }).then(([juegos]) => {
      if (juegos.length === 0) {
        juego = new Juego({nombre: nombre});
        let save = promisify(juego, 'save');
        return save();
      } else {
        resultado.codigo = 'duplicado';
        console.log('juego duplicado');
        throw ABORTAR;
      }
    }).then(_ => {
      jugador = new Jugador({
        juego: juego._id,
        rol: 1
      });
      let save = promisify(jugador, 'save');
      return save();
    }).then(_ => {
      req.session.id_jugador = jugador._id;
      resultado.creado = true;
      resultado.id=juego._id;
      resultado.codigo = 'bien';
      resultado.rol = jugador.rol;
      let tableritos = juego.getTableros(jugador.rol);
      console.log(tableritos);
    }).catch(err => {
      if (err !== ABORTAR) {
        console.log(err);
      }
    }).then(()=> {

      res.json(resultado)});
  }
});

//------------------------------------------------------------------------------
router.get('/batalla/estado/', (req, res) => {

  let resultado = { estado: 'error'};

  function ganado(tab){
    let count = 0;
    tab.forEach(function(row){
      row.forEach(function(x){
        if(x==='X') count++;
      });
    });
 
   (count===3) ? count=true : count = false;
   return count;
  }

  obtenerJuegoJugador(req, (err, juego, jugador) => {

    function eliminarJuegoJugadores () {
      let remove = promisify(jugador, 'remove');
      delete req.session.id_jugador;
      remove().then(_ => {
        let find = promisify(Jugador, 'find');
        return find({ juego: juego._id });
      }).then(([jugadores]) => {
        if (jugadores.length === 0) {
          let remove = promisify(juego, 'remove');
          return remove();
        }
      }).catch(err => console.log(err)
      ).then(_ => res.json(resultado));
    }

    if (err) {
      console.log(err);
      res.json(resultado);

    } else {
      let tablero = juego.getTableros(jugador.rol);
      let tablerocontr = juego.getTableros(contrincante(jugador.rol));
      resultado.tablero = tablero;
      if (!juego.iniciado) {
        resultado.estado = 'espera';  
        res.json(resultado);
      }

      else if(ganado(tablero[1])){
        resultado.estado = 'ganaste';
        console.log('gano');
        res.json(resultado);
        eliminarJuegoJugadores();
      }

      else if(ganado(tablerocontr[1])){
        resultado.estado = 'perdiste';
        res.json(resultado);
      }

      else if (juego.turno === jugador.rol && juego.READY===2) {
        resultado.estado = 'tu_turno';
        res.json(resultado);

      } else {
        resultado.estado = 'espera';
        res.json(resultado);
      }
    }
  });
});

router.get('/batalla/tablero_jugador/', function(req,res){

  let resultado = { estado: 'error'};

  obtenerJuegoJugador(req, function(err, juego, jugador){
    
    if (err) {
      console.log(err);
      res.json(resultado);

    }
    let tableros = juego.getTableros(jugador.rol);
    res.json(tableros[0]);
  })


});

//------------------------------------------------------------------------------
router.get('/batalla/juegos_existentes/', (req, res) => {
  Juego.find({ iniciado: false })
  .sort('nombre')
  .exec((err, juegos) => {
    if (err) {
      console.log(err);
    }
    res.json(juegos.map(x => ({ id: x._id, nombre: x.nombre })));
  });
});

//------------------------------------------------------------------------------
router.put('/batalla/tirar/', (req, res) => {

  let resultado = { efectuado: false };

  obtenerJuegoJugador(req, (err, juego, jugador) => {

    //--------------------------------------------------------------------------
    function guardarCambios(tablerojug, tablerocon, x, y, rol) {
      if(tablerocon[x][y] === 'Z'){
          tablerojug[x][y] = 'X';
          tablerocon[x][y] = 'X';
      }
      else{
          tablerojug[x][y] = 'W';
          tablerocon[x][y] = 'W';
          //console.log('cmbiando Turno', juego.turno);
          juego.turno = cambiarTurno(juego.turno);
      }
      
      juego.setTableros(rol, 1, tablerojug);
      juego.setTableros(contrincante(rol), 0, tablerocon);

      juego.save((err) => {
        if (err) {
          console.log(err);
        }
        resultado.efectuado = true;
        resultado.tablero = tablerojug;
        res.json(resultado);
      });
    }



    if (err) {
      console.log(err);
      res.json(resultado);

    } else {
      let x = parseInt(req.body.x);
      let y = parseInt(req.body.y);
      if (juego.turno === jugador.rol) {

        let tableroJugador = juego.getTableros(jugador.rol);
        let tableroContrincante = juego.getTableros(contrincante(jugador.rol));
        console.log('Enviando tiros...');
        guardarCambios(tableroJugador[1], tableroContrincante[0], x, y, jugador.rol);

        


      } else {
        res.json(resultado);
      }
    }
  });
});

router.put('/batalla/colocarBarco/', (req, res) => {

  let flag = true;
  let resultado = { colocado: false };
  obtenerJuegoJugador(req, (err, juego, jugador) => {

    //--------------------------------------------------------------------------
    function guardarCambios(tablero, index, blocks, orientation, rol) {
      
      if(orientation === "hor"){
        
        blocks.forEach(function(element){
          if(tablero[parseInt(index)][parseInt(element)] === 'Z'){
            flag = false;
            //resultado.colocado = false;
            //res.status(403).json(resultado);
          }
          tablero[parseInt(index)][parseInt(element)] = 'Z';
        });
      }

      else{
        
        blocks.forEach(function(element){

          if( tablero[parseInt(element)][parseInt(index)] === 'Z'){
            flag = false;
            //resultado.colocado = false;
            //res.status(403).json(resultado);
          }
          tablero[parseInt(element)][parseInt(index)] = 'Z';
          
        });
      }

      if(flag) okResponse(rol, tablero)
      else res.status(403).send();
      
    }

    function okResponse (rol, tablero) {
      juego.setTableros(rol, 0, tablero);
      //let save = promisify(juego, 'save');
      //return save();
      juego.save((err) => {
        if (err) {
          console.log(err);
        }
        resultado.colocado = true;
        resultado.tablero = tablero;
        //console.log('lego aca');
        res.json(resultado);
      });
    }


    if (err) {
      console.log(err);
      res.json(resultado);

    } else {
      let index = parseInt(req.body.ind);
      let blocks = req.body.bl;
      let orientation = req.body.or;
      let tablero = juego.getTableros(jugador.rol);
      
      guardarCambios(tablero[0], index, blocks, orientation, jugador.rol);
    }
  });
});

//------------------------------------------------------------------------------
router.put('/batalla/unir_juego/', (req, res) => {
  let resultado = { unido: false, codigo: 'id_malo' };
  let idJuego = req.body.id_juego;
  let juego;
  let jugador;

  if (idJuego) {
    let findOne = promisify(Juego, 'findOne');
    findOne({_id: idJuego}).then(([_juego]) => {
      juego = _juego;
      if (juego.iniciado) {
        throw ABORTAR;
      } else {
        juego.iniciado = true;
        let save = promisify(juego, 'save');
        return save();
      }
    }).then(_ => {
      jugador = new Jugador({
        juego: juego._id,
        rol: 2
      });
      let save = promisify(jugador, 'save');
      return save();
    }).then(_ => {
      req.session.id_jugador = jugador._id;
      resultado.unido = true;
      resultado.id=juego._id
      resultado.codigo = 'bien';
      resultado.rol = jugador.rol;
    }).catch(err => {
      if (err !== ABORTAR) {
        console.log(err);
      }
    }).then(_ => res.json(resultado));

  } else {
    res.json(resultado);
  }
});

//------------------------------------------------------------------------------
function contrincante(s) {
  return s === 1 ? 2 : 1;
}

function cambiarTurno(rol){
 return rol === 1 ? 2 : 1;
}

//------------------------------------------------------------------------------
function obtenerJuegoJugador(req, callback) {

  let idJugador = req.session.id_jugador;
  let juego;
  let jugador;

  if (idJugador) {
    let findOne = promisify(Jugador, 'findOne');
    findOne({ _id: idJugador }).then(([_jugador]) => {
      jugador = _jugador;
      let findOne = promisify(Juego, 'findOne');
      return findOne({ _id: jugador.juego });
    }).then(([_juego]) => {
      juego = _juego;
    }).catch(err => console.log(err)
    ).then(_ => callback(null, juego, jugador));

  } else {
    callback(new Error('La sesión no contiene el ID del jugador'));
  }
}
