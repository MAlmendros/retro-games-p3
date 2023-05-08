
const { cells } = require("../data/cell.data");
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

        const iPlayer = selectedRoom.players.findIndex((player) => player.id === userId);

        if (iPlayer === -1) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El usuario no existe, revise sus credenciales`
                });
        } else {
            newGame.players[iPlayer] = {
                id: selectedRoom.players[iPlayer].id,
                username: selectedRoom.players[iPlayer].username,
                avatar: selectedRoom.players[iPlayer].avatar,
                color: iPlayer === 0 ? '#007BFF' : '#DC3545',
                cells: [],
                score: 0
            };

            games.push(newGame);

            response.status(200).json(newGame);
        }
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

        const iPlayer = selectedRoom.players.findIndex((player) => player.id === userId);
        updateGame.players[iPlayer] = {
            id: selectedRoom.players[iPlayer].id,
            username: selectedRoom.players[iPlayer].username,
            avatar: selectedRoom.players[iPlayer].avatar,
            color: iPlayer === 0 ? '#007BFF' : '#DC3545',
            cells: [],
            score: 0,
        };


        let iGame = games.findIndex(game => game.id === selectedGame.id);
        games[iGame] = updateGame;

        response.status(200).json(updateGame);
    }
}

const conquerCell = async(request, response) => {
    const gameId = request.params.id;
    const { userId, cellId } = request.body;

    const selectedGame = games.find((game) => game.id === parseInt(gameId));

    if (!selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    } else {
        let selectedPlayer = selectedGame.players.find((player) => player.id === userId);

        if (!selectedPlayer) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El jugador no ha sido encontrado en la sala de juego.`
                });
        } else {
            const iPlayer = selectedGame.players.findIndex((player) => player.id === userId);
            const iRival = selectedGame.players.findIndex((player) => player.id !== userId);

            const controlRival = selectedGame.players[iRival].cells.includes(cellId);
            const controlPlayer = selectedGame.players[iPlayer].cells.includes(cellId);
            const controlLength = selectedGame.players[iPlayer].cells.length === 0;
            let controlAdjacent = selectedGame.players[iPlayer].cells.filter((cell) => cells[`${cell}`].includes(cellId)).length;
            
            if (controlRival) {
                response
                    .status(404)
                    .json({
                        status: 404,
                        message: `Esta celda ya ha sido conquistada por otro jugador`
                    });
            } else if (controlPlayer) {
                response
                    .status(404)
                    .json({
                        status: 404,
                        message: `Esta celda ya ha sido conquistada por otro jugador`
                    });
            } else if (!(controlLength || controlAdjacent)) {
                response
                    .status(404)
                    .json({
                        status: 404,
                        message: `Para conquistar esta celda necesitas tener en tu poder otra adyacente.`
                    });
            } else {
                let updateGame = selectedGame;
                updateGame.players[iPlayer] = {
                    ...selectedPlayer,
                    cells: [...selectedPlayer.cells, cellId],
                    score: selectedPlayer.score + 1
                };
        
                let iGame = games.findIndex(game => game.id === selectedGame.id);
                games[iGame] = updateGame;

                response
                    .status(200)
                    .json({
                        game: updateGame,
                        cellId,
                        iPlayer
                    });
            }
        }
    }
}

const deleteGame = async(request, response) => {
    const gameId = request.params.id;
    const { userId } = request.body;

    const selectedGame = games.find((game) => game.id === parseInt(gameId));

    if (!selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    } else {
        const iPlayer = selectedGame.players.findIndex((player) => player.id === userId);
        const iRival = selectedGame.players.findIndex((player) => player.id !== userId);
        const iGame = games.findIndex((game) => game.id === selectedGame.id);

        if (iPlayer === -1 || iGame === -1) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `Ha ocurrido un error inesperado.`
                });
        } else {
            let updateGame = selectedGame;
            updateGame.players[iPlayer] = {};

            console.log(updateGame);
            
            if (!updateGame.players[0].id && !updateGame.players[1].id) {
                games.splice(iGame, 1);

                response.status(200).json({
                    status: 200,
                    code: 'FINAL',
                    message: `Todos los jugadores han abandonado la sala y el juego ha sido eliminado.`
                });
            } else {
                updateGame.players[iRival] = {
                    ...updateGame.players[iRival],
                    cells: [],
                    score: 0
                };
                games[iGame] = updateGame;

                response.status(200).json({
                    status: 200,
                    code: 'LEAVE',
                    game: updateGame
                });
            }
        }
    }
}

module.exports.getGames = getGames;
module.exports.getGame = getGame;
module.exports.createGame = createGame;
module.exports.updateGame = updateGame;
module.exports.deleteGame = deleteGame;
module.exports.conquerCell = conquerCell;
