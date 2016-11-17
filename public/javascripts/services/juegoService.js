var app = angular.module('battleShipApp');


app.service('JuegoService', function($scope){

    var service = {};
    service.setGameId = setGameId;
    service.getGameId = getGameId;
    return service;

    function setGameId(gameId){
        console.log(gameId);
        this.gameid = gameId;
    }

    function getGameId(){
        return this.gameid;
    }

});