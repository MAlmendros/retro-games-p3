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
            .json({ message: `Game with id ${id} not found.` });
    }
}

const addPlayer = async(request, response) => {
    const { gameId, userId } = request.params;

    let selectedGame = games.find((game) => game.id === parseInt(gameId));
    let selectedUser = users.find((user) => user.id === parseInt(userId));

    if (!selectedGame) {
        response
            .status(404)
            .json({ message: `Game with id ${gameId} not found.` });
    } else if (!selectedUser) {
        response
            .status(404)
            .json({ message: `User with id ${userId} not found.` });
    } else {
        let selectedPlayer = selectedGame.players.find((player) => player.id === selectedUser.id);

        if (selectedPlayer) {
            response
                .status(404)
                .json({ message: `User with id ${userId} already in the game.` });
        } else if (selectedGame.limit <= selectedGame.players.length) {
            response
                .status(404)
                .json({ message: `This game is already full.` });
        } else {
            selectedGame.players.push(selectedUser);

            response.status(200).json(selectedGame);
        }
    }
}

const removePlayer = async(request, response) => {
    const { gameId, userId } = request.params;

    let selectedGame = games.find((game) => game.id === parseInt(gameId));
    let selectedUser = users.find((user) => user.id === parseInt(userId));

    if (!selectedGame) {
        response
            .status(404)
            .json({ message: `Game with id ${gameId} not found.` });
    } else if (!selectedUser) {
        response
            .status(404)
            .json({ message: `User with id ${userId} not found.` });
    } else {
        let newPlayers = selectedGame.players.filter((player) => player.id !== selectedUser.id);
        selectedGame.players = newPlayers;

        response.status(200).json(selectedGame);
    }
}
module.exports.getGames = getGames;
module.exports.getGame = getGame;
module.exports.addPlayer = addPlayer;
module.exports.removePlayer = removePlayer;
