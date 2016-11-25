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

    getJuegosExistentes();

    function getJuegosExistentes() {
        $scope.actualizando = false;
        $http.get('/batalla/juegos_existentes/').then(function(response){
            $scope.listaDeJuegos = response.data;
        });
    };

    $scope.RefrescarListaJuegos = function () {
        $scope.actualizando = true;
        $timeout(function(){
            getJuegosExistentes();
        },1500);
    }

    

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
        if(id===undefined || id===null){
            swal({
              title: "No se puede proceder",
              text: "Favor de seleccionar un juego",
              timer: 2500
            });
            return;
        }
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

