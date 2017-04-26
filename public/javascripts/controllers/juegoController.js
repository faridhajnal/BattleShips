var app = angular.module('battleShipApp');

app.controller('juegoController', function($scope, $http, $location, $timeout){
    var barcos = [
                    {name:"CARRIER",size: 9,id:"C", hits:0},
                    {name:"BATTLESHIP",size:6,id:"B", hits:0},
                    {name:"CRUISER",size:3,id:"R", hits:0},
                    {name:"SUBMARINE",size:3,id:"S", hits:0},
                    {name:"DESTROYER",size:2,id:"D", hits:0}
                  ]; 
    const PAUSA = 1000;
    $scope.tab = 1;

    $scope.changeTab = function(tabNum){
      $scope.tab = tabNum;
    };

    $scope.bloquearTablero = false;
    esperaTurno();
    $scope.tableroJugador = [[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
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

    $scope.tirosJugador = [[{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''},{value : '' , id : ''}]
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
    $scope.sunkShips = [];
    $scope.realizarTiro = function(event, x, y){
        
        switch(event.which){
             case 1 :
                tirar();
                break;
             default:
                break;
         }

        function tirar(){

            $http.put('/batalla/tirar/', {x : x, y : y}).then(function(response){
            /*console.log('tablero scope', $scope.tableroJugador);
            console.log('tablero respuesta', response.data.tablero);*/
            $scope.tableroJugador = response.data.tablero;
            esperaTurno();
            
            }).catch(function(error){
              console.log(error);
            });
          
        };
    };

    $scope.determinarLleno = function (tipo, fila, col){

        if(tipo === 1){
          if($scope.tableroJugador[fila][col].value === 'X'){
            
            return 1;
          }
          else if($scope.tableroJugador[fila][col].value === 'W') return 2;
        }
        else if(tipo === 2){

          if($scope.tirosJugador[fila][col].value === 'X'){
              return 1;
          } 
          else if($scope.tirosJugador[fila][col].value === 'Z') return 2;
          else if($scope.tirosJugador[fila][col].value === 'W') return 3;
        }
        
        else return 0;
    }

    function checkSunk(id){
      switch(id){
          case "C" :
                ( barcos[0].hits<barcos[0].size) ? barcos[0].hits+=1 : pushToArray(barcos[0].name);
                break;
          case "B" :
                ( barcos[1].hits<barcos[1].size) ? barcos[1].hits+=1 : pushToArray(barcos[1].name);
                break;
          case "R":
                ( barcos[2].hits<barcos[2].size) ? barcos[2].hits+=1 : pushToArray(barcos[2].name);
                break;
          case "S" :
                  ( barcos[3].hits<barcos[3].size) ? barcos[3].hits+=1 : pushToArray(barcos[3].name);
                  break;
          case "D" : 
                  ( barcos[4].hits<barcos[4].size) ? barcos[4].hits+=1 : pushToArray(barcos[4].name);
                  


      }
   
     
    };

    function pushToArray(name){
      if ($scope.sunkShips.indexOf(name) === -1) {
        $scope.sunkShips.push(name);
      } 
    };

    function esperaTurno() {

    var segundos = 0;

    function ticToc() {
      $scope.mensaje = "Esperando a tu rival (" + segundos + " segundos) ";
      segundos++;
      $http.get('/batalla/estado').then(function(resultado){
          var t = 0;
          
          $scope.tableroJugador = resultado.data.tablero[1];
          $scope.tirosJugador = resultado.data.tablero[0];
        
              $scope.tableroJugador.forEach(function(pos){
                pos.forEach(function(emt){
                  if(emt.value === 'X') checkSunk(emt.id);
                 
                });
              });
          
          
          switch (resultado.data.estado) {
        
          case 'tu_turno':
            $scope.mensaje = "es tu turno";
            segundos = 0;
            //turnoTirar(resultado.tablero);
            break;

          case 'espera':
            
            $scope.mensaje = "Esperando a tu rival (" + segundos + " segundos) ";
            setTimeout(ticToc, 1000);
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