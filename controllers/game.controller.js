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

const addPlayer = async(request, response) => {
    const { gameId, userId } = request.body;

    let selectedGame = games.find((game) => game.id === parseInt(gameId));
    let selectedUser = users.find((user) => user.id === parseInt(userId));

    if (!selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `La sala no existe.`
            });
    } else if (!selectedUser) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario no existe.`
            });
    } else {
        let selectedPlayer = selectedGame.players.find((player) => player.id === selectedUser.id);

        let otherGameUser = false;
        games.forEach(game => {
            const onGame = game.players.find((player) => player.id === selectedUser.id);
            if (onGame) {
                otherGameUser = true;
            }
        });

        if (selectedPlayer) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El usuario "${selectedUser.username}" ya está en la sala "${selectedGame.name}".`
                });
        } else if (!selectedPlayer && otherGameUser) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El usuario "${selectedUser.username}" ya está en otra sala.`
                });
        } else if (selectedGame.limit <= selectedGame.players.length) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `La sala "${selectedGame.name}" está llena.`
                });
        } else {
            selectedGame.players.push(selectedUser);

            response.status(200).json(selectedGame);
        }
    }
}

const removePlayer = async(request, response) => {
    const { gameId, userId } = request.body;

    let selectedGame = games.find((game) => game.id === parseInt(gameId));
    let selectedUser = users.find((user) => user.id === parseInt(userId));

    if (!selectedGame) {
        response
            .status(404)
            .json({ message: `La sala no existe.` });
    } else if (!selectedUser) {
        response
            .status(404)
            .json({ message: `El usuario no existe.` });
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
