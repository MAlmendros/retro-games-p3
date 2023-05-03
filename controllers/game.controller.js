const { games } = require("../data/game.data");
const { users } = require("../data/user.data");

const getGames = async(request, response) => {
    response.status(200).json(games);
}

const getGame = async(request, response) => {
    const gameId = request.params.id;

    const selectedGame = games.find((game) => game.id === parseInt(gameId));

    if (selectedGame) {
        response.status(200).json(selectedGame);
    } else {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    }
}

const createGame = async(request, response) => {
    const newGame = request.body;

    let selectedGame = games.find((game) => game.id === newGame.id);

    if (selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Ya existe un juego en la sala "${selectedGame.name}".`
            });
    } else if (!newGame.id || !newGame.name || !newGame.playerA || !newGame.playerB) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Ha ocurrido un error al crear la sala "${newGame.name}".`
            });
    } else {
        games.push(newGame);

        response.status(200).json(newGame);
    }
}

const updateGame = async(request, response) => {
    const gameId = request.params.id;
    const updateGame = request.body;

    let selectedGame = games.find((game) => game.id === parseInt(gameId));

    if (!selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    } else if (updateGame.id !== parseInt(gameId)) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Los datos del juego están corruptos.`
            });
    } else {
        let index = games.findIndex(game => game.id === selectedGame.id);
        games[index] = updateGame;

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
