var app = angular.module('battleShipApp', ['ngRoute'])
.config(function($routeProvider){
    $routeProvider
    .when('/menu', {
        templateUrl : 'templates/menu.html',
        controller : 'menuController'
    })
    .when('/crear', {
        templateUrl : 'templates/crear-juego.html',
        controller : 'menuController'
    })
    .when('/unir', {
        templateUrl : 'templates/unir-juego.html',
        controller : 'menuController'
    })
    .when('/juego/:idjuego', {
        templateUrl : 'templates/juego-jugando.html',
        controller : 'juegoController'
    })
    .when('/colocar/:idjuego', {
        templateUrl : 'templates/colocar-barcos.html',
        controller : 'colocarController'
    })
    .otherwise({
        redirectTo : '/menu'
    });
});

