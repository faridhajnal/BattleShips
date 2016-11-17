var app = angular.module('battleShipApp');

app.controller('colocarController', function($scope, $http, $location){

    const PAUSA = 5000;
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
    $scope.orientacion = "h";

    $scope.barcoAcolocar = barcos[barcosCounter];

    function sobrino(horizontal, index, tableroJugador, blockArray){

            console.log('index', index);
            for(var i = 0; i<blockArray.length; i++)
            {
                if(horizontal){
                    $scope.TableroJugador[index][blockArray[i]] = 'Z';
                } else{
                    $scope.TableroJugador[blockArray[i]][index] = 'Z';
                }
            }
            
        
        console.log($scope.TableroJugador);
    }

    $scope.guardar = function(x, y, or){
          if(barcosCounter < 5){
            var o = or;
            var barcoAcolocar = barcos[barcosCounter];
            var sumx = x+barcoAcolocar.size;
            var sumy = y+barcoAcolocar.size;
            var block_array = [];
            if(o === 'h'){
                if(sumx > 10){
                    console.log('invalido en x');
                }
                else{
                    console.log('tiro valido');
                    var index = x;
                    for(let i = y; i < sumy; i++){
                        block_array.push(i);
                    }                

                    $http.put('/batalla/colocarBarco/', {ind : index, or: o, bl: block_array}).then(function(response){
                        barcosCounter++;
                        sobrino(true, index, response.data.tablero, block_array);
                        swal("Barco Colocado", "todo chido :)");
                        console.log('tablero jugadors', $scope.tableroJugador);
                        if(barcosCounter === 5){
                            
                            $scope.barcoAcolocar = {
                                name : 'Ninguno',
                                size : 'N/D'
                            }
                            readyToPlay = true;
                            $location.path('/juego');                      
                        }
                        else
                        $scope.barcoAcolocar = barcos[barcosCounter];
                    }).catch(function(error){
                        console.log('ocupado');
                        throw error;
                    });
                    
                }
                
            }

            else if(o === 'v'){
                if( sumy > 10){
                console.log('invalido en y');
                }
                else{
                    console.log('tiro valido');
                    var index = y;
                    for(let i = x; i < sumx; i++){
                        block_array.push(i);
                    }
                    $http.put('/batalla/colocarBarco/', {ind : index, or: o, bl: block_array}).then(function(response){
                        barcosCounter++;
                        sobrino(false, index, response.data.tablero, block_array);
                        swal("Barco Colocado", "todo chido :)");
                        $scope.tableroJugador = response.data.tablero;
                        if(barcosCounter === 5){
                            $scope.barcoAcolocar = {
                                name : 'Ninguno',
                                size : 'N/D'
                            }
                            $location.path('/juego');  
                        }
                        else
                        $scope.barcoAcolocar = barcos[barcosCounter];
                    }).catch(function(error){
                        console.log('ocupado');
                        throw error;
                    });
                    
                }
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
    }

    $scope.determinarLleno = function (fila, col){
        return $scope.TableroJugador[fila][col] === 'Z';
    }

    $scope.seleccionarCoordenada = function(le, nu, or){
        
        if(barcosCounter < 5){
            var y = numeroDeLetra(le);
            var x = nu;
            var o = or;
            var barcoAcolocar = barcos[barcosCounter];
            var sumx = x+barcoAcolocar.size;
            var sumy = y+barcoAcolocar.size;
            console.log('x',x); console.log('y',y); console.log('or',o);
            console.log('barco', barcoAcolocar);
            var block_array = [];
            if(o === 'h'){
                if(sumx > 10){
                    console.log('invalido en x');
                }
                else{
                    console.log('tiro valido');
                    var index = y;
                    for(let i = x; i < sumx; i++){
                        block_array.push(i);
                    }

                    var  generaCoordenadas = function(index, blockArray){
                         fila = $scope.letras.indexOf(index);

                    }                    

                    $http.put('/batalla/colocarBarco/', {ind : index, or: o, bl: block_array}).then(function(response){
                        barcosCounter++;
                        swal("Barco Colocado", "todo chido :)");
                        actualizarTablero(response.data.tablero);
                        $scope.tableroJugador = response.data.tablero;
                        console.log('tablero jugadors', $scope.tableroJugador);
                        if(barcosCounter === 5){
                            
                            $scope.barcoAcolocar = {
                                name : 'Ninguno',
                                size : 'N/D'
                            }
                            readyToPlay = true;
                            $location.path('/juego');                      
                        }
                        else
                        $scope.barcoAcolocar = barcos[barcosCounter];
                    }).catch(function(error){
                        console.log('ocupado');
                        throw error;
                    });
                    
                }
                
            }

            else if(o === 'v'){
                if( sumy > 10){
                console.log('invalido en y');
                }
                else{
                    console.log('tiro valido');
                    var index = x;
                    for(let i = y; i < sumy; i++){
                        block_array.push(i);
                    }
                    $http.put('/batalla/colocarBarco/', {ind : index, or: o, bl: block_array}).then(function(response){
                        barcosCounter++;
                        swal("Barco Colocado", "todo chido :)");
                        $scope.tableroJugador = response.data.tablero;
                        if(barcosCounter === 5){
                            $scope.barcoAcolocar = {
                                name : 'Ninguno',
                                size : 'N/D'
                            }
                            $location.path('/juego');  
                        }
                        else
                        $scope.barcoAcolocar = barcos[barcosCounter];
                    }).catch(function(error){
                        console.log('ocupado');
                        throw error;
                    });
                    
                }
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

    
    function numeroDeLetra(letra){
    for(let j = 0; j < $scope.letras.length; j++){
            if(letra===$scope.letras[j]){
              return j;
            }
          }
    };



})