var app = angular.module('battleShipApp');

app.controller('menuController', ['$scope', '$location', '$http', '$timeout',
 function($scope, $location, $http, $timeout){
    
    $scope.creadoBien = false;

    $scope.crearJuego = function () {
        $location.path('/crear');
    };

    $scope.unirJuego = function () {
        $location.path('/unir');
    };

    $scope.listaDeJuegos = [];

    $http.get('/batalla/juegos_existentes/').then(function(response){
        
        response.data.forEach(function(element){
            $scope.listaDeJuegos.push(element);
        });
    });

    $scope.ApiCrearJuego = function () {
        console.log('intentando crear con nombre:', $scope.nombreJuego);

        $http.post('/batalla/crear_juego/', {nombre : $scope.nombreJuego}).then(function(response){
            if(response.data.codigo === "duplicado") {
                swal({
                    title: "No se puede crear Juego",
                    text: "Ya existe otro juego con este nombre",
                    type: "error",
                    confirmButtonText: "Entendido"
                    });
            }
            else{
                $scope.creadoBien = true;
                $timeout(function(){
                    $location.path('/colocar/'+response.data.id);
                }, 2000);

            }
            
        }).catch(function(error){
            console.log('error de servidor', error);
        });


    };

    $scope.ApiUnirJuego = function (id) {
        $http.put('/batalla/unir_juego/', {id_juego : id}).then(function(response){
            console.log(response.data);
            $timeout(function(){
                    $location.path('/colocar/'+response.data.id);
                }, 1000 );
        }).catch(function(error){
            console.log('Error de sistema');
        })
    };


}]);

