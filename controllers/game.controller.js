const { games } = require("../data/game.data");
const { users } = require("../data/user.data");

const getGames = async(request, response) => {
    response.status(200).json(games);
}

const getGame = async(request, response) => {
    const id = request.params.id;

    const selectedGame = games.find((game) => game.id === parseInt(id));

    if (selectedGame) {
        response.status(200).json(selectedGame);
    } else {
        response
            .status(404)
            .json({
                status: 404,
                message: `La sala no existe.`
            });
    }
}

const createGame = async(request, response) => {
    const newGame = request.body;

    let selectedGame = games.find((game) => game.room === newGame.room);

    if (selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Ya existe un juego en la sala "${selectedGame.name}".`
            });
    } else if (!newGame.room || !newGame.name || !newGame.playerA || !newGame.playerB) {
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

const deleteGame = async(request, response) => {
    const message = 'TODO - deleteGame';
    console.log(message);
    response.status(200).json({ message });
}

module.exports.getGames = getGames;
module.exports.getGame = getGame;
module.exports.createGame = createGame;
module.exports.deleteGame = deleteGame;
