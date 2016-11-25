var app = angular.module('battleShipApp');

app.controller('colocarController', function($scope, $http, $location, $routeParams, $timeout){


    $scope.juegoid = $routeParams.idjuego;
    const PAUSA = 1000;
    var barcosCounter = 0;
    var barcos = [
                {name:"CARRIER",size: 5,id:"C",orien:"",blocks:[]},
                {name:"BATTLESHIP",size:4,id:"B",orien:"",blocks:[]},
                {name:"CRUISER",size:3,id:"R",orien:"",blocks:[]},
                {name:"SUBMARINE",size:3,id:"S",orien:"",blocks:[]},
                {name:"DESTROYER",size:2,id:"D",orien:"",blocks:[]}
              ]; 
    $scope.TableroJugador = [[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
,[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
,[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
,[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
,[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
,[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
,[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
,[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
,[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
,[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
];


    $scope.numeros = [0,1,2,3,4,5,6,7,8,9];
    $scope.letras = ['A','B','C','D','E','F','G','H','I','J'];
    $scope.orientacion = "hor";

    $scope.barcoAcolocar = barcos[barcosCounter];

    function sobrino(ship,orientacion, index, tableroJugador, blockArray){
            for(var i = 0; i<blockArray.length; i++)
            {
                if(orientacion==="hor"){
                    $scope.TableroJugador[index][blockArray[i]].value = 'Z';
                    $scope.TableroJugador[index][blockArray[i]].id = ship.id;
                } else{
                    $scope.TableroJugador[blockArray[i]][index].value = 'Z';
                    $scope.TableroJugador[blockArray[i]][index].id = ship.id;
                }
            }
            console.log('tablero',$scope.TableroJugador);
    }

    function enviarBarcoApi(orientacion, barco, inicial, indice){
        var sum = inicial+barco.size;
        var id = barco.id;
        var block_array = [];
        if(sum > 10){
            swal("Inválido", "Tu tiro no cabe en el tablero");
        }
        else{
            var index = indice;
            for(let i = inicial; i < sum; i++){
                block_array.push(i);
            }
            barco.blocks=block_array;                

            $http.put('/batalla/colocarBarco/', {ind : index, id:id ,or: orientacion, bl: block_array}).then(function(response){
                barcosCounter++;
                sobrino(barco,orientacion, index, response.data.tablero, block_array);

                if(barcosCounter === 5){
                    
                    $scope.barcoAcolocar = {
                        name : 'Ninguno',
                        size : 'N/D'
                    }
                    $http.put('/batalla/pready/', {id_juego: $scope.juegoid}).then(function(response){
                        
                        swal({
                          title: "Listo!",
                          text: "Redireccionando...",
                          timer: 2000,
                          showConfirmButton: false
                        });
                        $timeout(function(){
                            $location.path('/juego/'+$scope.juegoid);
                        },2000);
                    }).catch(function(error){
                        console.log('ERROR', error);      
                    });
                                            
                }
                else
                $scope.barcoAcolocar = barcos[barcosCounter];
            }).catch(function(error){
                console.log('ocupado');
                throw error;
            });
            
        }
                
    }

    $scope.guardar = function(event, y, x){
         var or;
         event.preventDefault();
         switch(event.which){
             case 1 :
                or = "hor";
                break;
             case 2 : 
                break;
             case 3 : 
                or = "ver";
                break;
             default:
                break;
         }
          
          if(barcosCounter < 5){
            var o = or;
            var barcoAcolocar = barcos[barcosCounter];            
            if(o === 'hor'){
                enviarBarcoApi(o, barcoAcolocar, x, y);               
            }

            else if(o === 'ver'){
                enviarBarcoApi(o, barcoAcolocar, y, x);
            }
          }

          else{
            
            swal({
                    title: "No se pueden colocar más barcos",
                    text: "Ya has colocado tus 5 barcos",
                    type: "info",
                    confirmButtonText: "OK"
                    });
            return;
           }
    };

    $scope.determinarLleno = function (fila, col){
        return $scope.TableroJugador[fila][col].value === 'Z';
    };
    
    function numeroDeLetra(letra){
    for(let j = 0; j < $scope.letras.length; j++){
            if(letra===$scope.letras[j]){
              return j;
            }
          }
    };



})