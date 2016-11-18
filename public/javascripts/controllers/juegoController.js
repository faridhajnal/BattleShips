var app = angular.module('battleShipApp');

app.controller('juegoController', function($scope, $http, $location){
    
    const PAUSA = 1000;
    $scope.tab = 1;

    $scope.changeTab = function(tabNum){
      console.log('changeTab', tabNum);
      $scope.tab = tabNum;
    };

    $scope.bloquearTablero = false;
    esperaTurno();
    $scope.tableroJugador = [   ['','','','','','','','','',''],
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
    $scope.tirosJugador = [   ['','','','','','','','','',''],
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
    
    $scope.realizarTiro = function(x, y){
        
        console.log('x',x);
        console.log('y', y);
        console.log('llamando');
        $http.put('/batalla/tirar/', {x : x, y : y}).then(function(response){
            /*console.log('tablero scope', $scope.tableroJugador);
            console.log('tablero respuesta', response.data.tablero);*/
            $scope.tableroJugador = response.data.tablero;
            esperaTurno();
            console.log('actualizado');
        }).catch(function(error){
          console.log(error);
        });
    };

    $scope.determinarLleno = function (tipo, fila, col){
        if(tipo === 1){
          if($scope.tableroJugador[fila][col] === 'X') return 1;
          else if($scope.tableroJugador[fila][col] === 'W') return 2;
        }
        else if(tipo === 2){
          if($scope.tirosJugador[fila][col] === 'X') return 1;
          else if($scope.tirosJugador[fila][col] === 'Z') return 2;
          else if($scope.tirosJugador[fila][col] === 'W') return 3;
        }
        
        else return 0;
    }

    function esperaTurno() {

    var segundos = 0;

    function ticToc() {
      $scope.mensaje = "Esperando a tu rival (" + segundos + " segundos) ";
      segundos++;
      $http.get('/batalla/estado').then(function(resultado){
          
          $scope.tableroJugador = resultado.data.tablero[1];
          $scope.tirosJugador = resultado.data.tablero[0];
          
          console.log('estado', resultado.data.estado);

          switch (resultado.data.estado) {
        
          case 'tu_turno':
            console.log('tu turno');
            $scope.mensaje = "es tu turno";
            segundos = 0;
            //turnoTirar(resultado.tablero);
            break;

          case 'espera':
            console.log('ESPERA');
            $scope.mensaje = "Esperando a tu rival (" + segundos + " segundos) ";
            setTimeout(ticToc, PAUSA);
            break;

          case 'ganaste':
            
            $scope.mensaje = "¡GANASTE!"
            $scope.bloquearTablero = true;
            break;

          case 'perdiste':
            
            $scope.mensaje = "¡PERDISTE!"
            $scope.bloquearTablero = true;
            break;
          }
          
      });
    }
    setTimeout(ticToc, 0);
    
  }

});