var app = angular.module('battleShipApp');

app.controller('juegoController', function($scope, $http, $location){
    
    const PAUSA = 5000;
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
    
    $scope.realizarTiro = function(le, nu){
        var x = numeroDeLetra(le);
        var y = nu;
        $http.put('/batalla/tirar/', {x : x, y : y}).then(function(response){
            console.log('tiro', response);
        });
    };

    function numeroDeLetra(letra){
    for(let j = 0; j < $scope.letras.length; j++){
            if(letra===$scope.letras[j]){
              return j;
            }
          }
    };

    function esperaTurno() {

    var segundos = 0;

    function ticToc() {
      $scope.mensaje = "Llevas " + segundos + " segundos esperando...";
      segundos+=5;
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
            setTimeout(ticToc, PAUSA);
            break;

          case 'ganaste':
            //finDeJuego('<strong>Ganaste.</strong> ¡Felicidades!');
            //resalta(resultado.tablero);
            break;

          case 'perdiste':
            //finDeJuego('<strong>Perdiste.</strong> ¡Lástima!');
            //actualizar(resultado.tablero);
            //resalta(resultado.tablero);
            break;
          }
          
      });
    }
    setTimeout(ticToc, 0);
    
  }

});