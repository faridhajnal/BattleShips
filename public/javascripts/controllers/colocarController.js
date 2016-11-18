var app = angular.module('battleShipApp');

app.controller('colocarController', function($scope, $http, $location, $routeParams, $timeout){


    $scope.juegoid = $routeParams.idjuego;
    const PAUSA = 1000;
    var barcosCounter = 0;
    const barcos = [
                {name:"CARRIER",size: 5},
                {name:"BATTLESHIP",size:4},
                {name:"CRUISER",size:3},
                {name:"SUBMARINE",size:3},
                {name:"DESTROYER",size:2}
                ];
    $scope.TableroJugador = [   ['','','','','','','','','',''],
                                ['','','','','','','','','',''],
                                ['','','','','','','','','',''],
                                ['','','','','','','','','',''],
                                ['','','','','','','','','',''],
                                ['','','','','','','','','',''],
                                ['','','','','','','','','',''],
                                ['','','','','','','','','',''],
                                ['','','','','','','','','',''],
                                ['','','','','','','','','',''],
                            ];
    $scope.numeros = [0,1,2,3,4,5,6,7,8,9];
    $scope.letras = ['A','B','C','D','E','F','G','H','I','J'];
    $scope.orientacion = "hor";

    $scope.barcoAcolocar = barcos[barcosCounter];

    function sobrino(orientacion, index, tableroJugador, blockArray){
            for(var i = 0; i<blockArray.length; i++)
            {
                if(orientacion==="hor"){
                    $scope.TableroJugador[index][blockArray[i]] = 'Z';
                } else{
                    $scope.TableroJugador[blockArray[i]][index] = 'Z';
                }
            }
    }

    function enviarBarcoApi(orientacion, barco, inicial, indice){
        var sum = inicial+barco.size;
        var block_array = [];
        if(sum > 10){
            swal("Inválido", "Tu tiro no cabe en el tablero");
        }
        else{
            var index = indice;
            for(let i = inicial; i < sum; i++){
                block_array.push(i);
            }                

            $http.put('/batalla/colocarBarco/', {ind : index, or: orientacion, bl: block_array}).then(function(response){
                barcosCounter++;
                sobrino(orientacion, index, response.data.tablero, block_array);

                if(barcosCounter === 5){
                    
                    $scope.barcoAcolocar = {
                        name : 'Ninguno',
                        size : 'N/D'
                    }
                    $http.put('/batalla/pready/', {id_juego: $scope.juegoid}).then(function(response){
                        
                        swal("Listo", "Redireccionando...");
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
        return $scope.TableroJugador[fila][col] === 'Z';
    };
    
    function numeroDeLetra(letra){
    for(let j = 0; j < $scope.letras.length; j++){
            if(letra===$scope.letras[j]){
              return j;
            }
          }
    };



})