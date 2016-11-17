var app = angular.module('battleShipApp');

app.controller('juegoController', function($scope, $http, $location){
    
    const PAUSA = 2000;
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
            console.log('actualizado');
        }).catch(function(error){
          console.log(error);
        });
    };

    $scope.determinarLleno = function (fila, col){
        if($scope.tableroJugador[fila][col] === 'X') return 1;
        else if($scope.tableroJugador[fila][col] === 'W') return 2;
        else return 0;
    }

    function esperaTurno() {

    var segundos = 0;

    function ticToc() {
      $scope.mensaje = "Llevas " + segundos + " segundos esperando...";
      segundos+=2;
      $http.get('/batalla/estado').then(function(resultado){
          console.log(resultado);
          switch (resultado.data.estado) {
        
          case 'tu_turno':
            console.log('tu turno');
            $scope.mensaje = "es tu turno";
            segundos = 0;
            //turnoTirar(resultado.tablero);
            break;

          case 'espera':
            //console.log('pausa', PAUSA);
            $scope.mensaje = "Llevas " + segundos + " segundos esperando...";
            setTimeout(ticToc, PAUSA);
            break;

          case 'ganaste':
            //finDeJuego('<strong>Ganaste.</strong> ¡Felicidades!');
            //resalta(resultado.tablero);
            break;

          case 'perdiste':
            
            $scope.mensaje = "¡PERDISTE!"
            break;
          }
          
      });
    }
    setTimeout(ticToc, 0);
    
  }

});