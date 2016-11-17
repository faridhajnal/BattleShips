var app = angular.module('battleShipApp');

app.controller('menuController', function($scope, $location, $http, $timeout){
    
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
        console.log('lista Juegos', $scope.listaDeJuegos);
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


                console.log(response.data);
                //juegoService.setGameId(response.data.id);
                $scope.creadoBien = true;
                $timeout(function(){
                    $location.path('/colocar');
                }, 2000);

            }
            
        }).catch(function(error){
            console.log('error de servidor', error);
        });


    };

    $scope.ApiUnirJuego = function (id) {
        $http.put('/batalla/unir_juego/', {id_juego : id}).then(function(response){
            $timeout(function(){
                    $location.path('/colocar');
                }, 1000 );
        }).catch(function(error){
            console.log('Error de sistema');
        })
    };


});

