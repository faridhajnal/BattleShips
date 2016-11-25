/*******************************************************************************
 * Juego de Gato distribuido
 * Definición de constantes.
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

exports.TIROS = ['X', '.'];
/* Tablero en blanco
exports.TABLERO_EN_BLANCO : [[' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' '],
								[' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' '],
								[' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' '],
								[' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' '],
								[' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' '],
								[' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' '],
								[' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' '],
								[' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' '],
								[' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' '],
								[' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ']
							]
*/

/* TABLERO CON NÚMEROS */exports.TABLERO_EN_BLANCO = [
[{value:'0',id:''},{value:'1',id:''},{value:'2',id:''},{value:'3',id:''},{value:'4',id:''},{value:'5',id:''},{value:'6',id:''},{value:'7',id:''},{value:'8',id:''},{value:'9',id:''}],
[{value:'0',id:''},{value:'1',id:''},{value:'2',id:''},{value:'3',id:''},{value:'4',id:''},{value:'5',id:''},{value:'6',id:''},{value:'7',id:''},{value:'8',id:''},{value:'9',id:''}],
[{value:'0',id:''},{value:'1',id:''},{value:'2',id:''},{value:'3',id:''},{value:'4',id:''},{value:'5',id:''},{value:'6',id:''},{value:'7',id:''},{value:'8',id:''},{value:'9',id:''}],
[{value:'0',id:''},{value:'1',id:''},{value:'2',id:''},{value:'3',id:''},{value:'4',id:''},{value:'5',id:''},{value:'6',id:''},{value:'7',id:''},{value:'8',id:''},{value:'9',id:''}],
[{value:'0',id:''},{value:'1',id:''},{value:'2',id:''},{value:'3',id:''},{value:'4',id:''},{value:'5',id:''},{value:'6',id:''},{value:'7',id:''},{value:'8',id:''},{value:'9',id:''}],
[{value:'0',id:''},{value:'1',id:''},{value:'2',id:''},{value:'3',id:''},{value:'4',id:''},{value:'5',id:''},{value:'6',id:''},{value:'7',id:''},{value:'8',id:''},{value:'9',id:''}],
[{value:'0',id:''},{value:'1',id:''},{value:'2',id:''},{value:'3',id:''},{value:'4',id:''},{value:'5',id:''},{value:'6',id:''},{value:'7',id:''},{value:'8',id:''},{value:'9',id:''}],
[{value:'0',id:''},{value:'1',id:''},{value:'2',id:''},{value:'3',id:''},{value:'4',id:''},{value:'5',id:''},{value:'6',id:''},{value:'7',id:''},{value:'8',id:''},{value:'9',id:''}],
[{value:'0',id:''},{value:'1',id:''},{value:'2',id:''},{value:'3',id:''},{value:'4',id:''},{value:'5',id:''},{value:'6',id:''},{value:'7',id:''},{value:'8',id:''},{value:'9',id:''}],
[{value:'0',id:''},{value:'1',id:''},{value:'2',id:''},{value:'3',id:''},{value:'4',id:''},{value:'5',id:''},{value:'6',id:''},{value:'7',id:''},{value:'8',id:''},{value:'9',id:''}]

]; 


/* tablero alternativo

exports.TABLERO_EN_BLANCO : [['0','0','0','0','0','0','0','0','0','0'],
                             ['1','1','1','1','1','1','1','1','1','1'],
                             ['2','2','2','2','2','2','2','2','2','2'],
                             ['3','3','3','3','3','3','3','3','3','3'],
                             ['4','4','4','4','4','4','4','4','4','4'],
                             ['5','5','5','5','5','5','5','5','5','5'],
                             ['6','6','6','6','6','6','6','6','6','6'],
                             ['7','7','7','7','7','7','7','7','7','7'],
                             ['8','8','8','8','8','8','8','8','8','8'],
                             ['9','9','9','9','9','9','9','9','9','9']
                            ];

                            */