/*******************************************************************************
 * Juego de Gato distribuido
 * Definición del modelo Juego.
 * Copyright (C) 2013-2016 por Ariel Ortiz
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

var mongoose = require('mongoose');
var constantes = require('./constantes.js');

//-------------------------------------------------------------------------------
var esquemaJuego = mongoose.Schema({
  nombre:   String,
  iniciado: { type: Boolean,
              default: false },
  turno:    { type: Number, default:
              1 },
  READY:    { type: Number, default:
              0 },
  tablero_j1_own:  { type: String,
              default: JSON.stringify(constantes.TABLERO_EN_BLANCO) },
  tablero_j2_own:  { type: String,
              default: JSON.stringify(constantes.TABLERO_EN_BLANCO) },
  tablero_j1_game:  { type: String,
              default: JSON.stringify(constantes.TABLERO_EN_BLANCO) },
  tablero_j2_game:  { type: String,
              default: JSON.stringify(constantes.TABLERO_EN_BLANCO) }
});

//-------------------------------------------------------------------------------
esquemaJuego.methods.getTableros = function (userRole) {

  console.log('llamando usando rol', userRole);
  let tableros = [];
  if(userRole === 1){
      tableros.push(JSON.parse(this.tablero_j1_game));
      tableros.push(JSON.parse(this.tablero_j1_own));
      console.log('terminando');
  }

  else if(userRole === 2){
      tableros.push(JSON.parse(this.tablero_j2_game));
      tableros.push(JSON.parse(this.tablero_j2_own));
  }
  
  //console.log(tableros);
  return tableros;
};


//-------------------------------------------------------------------------------
esquemaJuego.methods.setTableros = function (userRole, tableroNumber, tablero) {

  if(userRole === 1){ //echando el Piña
      if(tableroNumber === 0){
        this.tablero_j1_game = JSON.stringify(tablero);
      }

      else if(tableroNumber === 1){
        this.tablero_j1_own = JSON.stringify(tablero);
      }
      
  }

  else if(userRole === 2){
      if(tableroNumber === 0){
        this.tablero_j2_game = JSON.stringify(tablero);
      }

      else if(tableroNumber === 1){
        this.tablero_j2_own = JSON.stringify(tablero);
      }
      
  }

};

//-------------------------------------------------------------------------------
module.exports = mongoose.model('Juego', esquemaJuego);
