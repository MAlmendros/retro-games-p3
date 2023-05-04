const { games } = require("../data/game.data");
const { rooms } = require("../data/room.data");

const getGames = async(request, response) => {
    response.status(200).json(games);
}

const getGame = async(request, response) => {
    const gameId = request.params.id;

    const selectedGame = games.find((game) => game.id === parseInt(gameId));

    if (selectedGame) {
        response.status(200).json(selectedGame);
    } else {
        const selectedRoom = rooms.find((room) => room.id === parseInt(gameId));

        if (selectedRoom) {
            response
                .status(200)
                .json({
                    status: 200,
                    message: `La sala está libre para jugar.`
                })
        } else {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `Ha ocurrido un error.`
                });
        }
    }
}

const createGame = async(request, response) => {
    const { roomId, userId } = request.body;

    let selectedGame = games.find((game) => game.id === roomId);

    if (selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Ya existe un juego en la sala "${selectedGame.name}".`
            });
    } else if (!roomId || !userId) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Ha ocurrido un error al crear el juego.`
            });
    } else {
        const selectedRoom = rooms.find((room) => room.id === roomId);

        let newGame = {
            id: selectedRoom.id,
            name: selectedRoom.name,
            players: [{}, {}]
        };

        const index = selectedRoom.players.findIndex((player) => player.id === userId);
        newGame.players[index] = {
            id: selectedRoom.players[index].id,
            username: selectedRoom.players[index].username,
            avatar: selectedRoom.players[index].avatar
        };

        games.push(newGame);

        response.status(200).json(newGame);
    }
}

const updateGame = async(request, response) => {
    const gameId = request.params.id;
    const { roomId, userId } = request.body;

    let selectedGame = games.find((game) => game.id === parseInt(gameId));

    if (!selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    } else if (roomId !== parseInt(gameId)) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Los datos del juego están corruptos.`
            });
    } else {
        const selectedRoom = rooms.find((room) => room.id === roomId);
        let updateGame = selectedGame;

        const index = selectedRoom.players.findIndex((player) => player.id === userId);
        updateGame.players[index] = {
            id: selectedRoom.players[index].id,
            username: selectedRoom.players[index].username,
            avatar: selectedRoom.players[index].avatar
        };


        let indexG = games.findIndex(game => game.id === selectedGame.id);
        games[indexG] = updateGame;

        response.status(200).json(updateGame);
    }
}

const deleteGame = async(request, response) => {
    const gameId = request.params.id;

    const selectedGame = games.find((game) => game.id === parseInt(gameId));

    if (!selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    } else {
        let index = games.findIndex(game => game.id === selectedGame.id);

        if (index === null) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `Ha ocurrido un error inesperado.`
                });
        } else {
            games.splice(index, 1);

            response.status(200).json({
                status: 200,
                message: `El juego ha finalizado y ha sido eliminado.`
            });
        }
    }
}

module.exports.getGames = getGames;
module.exports.getGame = getGame;
module.exports.createGame = createGame;
module.exports.updateGame = updateGame;
module.exports.deleteGame = deleteGame;
