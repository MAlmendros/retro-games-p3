const { rooms } = require("../data/room.data");
const { users } = require("../data/user.data");

const getRooms = async(request, response) => {
    response.status(200).json(rooms);
}

const getRoom = async(request, response) => {
    const id = request.params.id;

    const selectedRoom = rooms.find((room) => room.id === parseInt(id));

    if (selectedRoom) {
        response.status(200).json(selectedRoom);
    } else {
        response
            .status(404)
            .json({
                status: 404,
                message: `La sala de juego no existe.`
            });
    }
}

const addPlayer = async(request, response) => {
    const { roomId, userId } = request.body;

    let selectedRoom = rooms.find((room) => room.id === parseInt(roomId));
    let selectedUser = users.find((user) => user.id === parseInt(userId));

    if (!selectedRoom) {
        response
            .status(404)
            .json({
                status: 404,
                message: `La sala de juego no existe.`
            });
    } else if (!selectedUser) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario no existe.`
            });
    } else {
        let selectedPlayer = selectedRoom.players.find((player) => player.id === selectedUser.id);

        let otherRoomUser = false;
        rooms.forEach(room => {
            const onRoom = room.players.find((player) => player.id === selectedUser.id);
            if (onRoom) {
                otherRoomUser = true;
            }
        });

        if (selectedPlayer) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El usuario "${selectedUser.username}" ya está en la sala "${selectedRoom.name}".`
                });
        } else if (!selectedPlayer && otherRoomUser) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El usuario "${selectedUser.username}" ya está en otra sala.`
                });
        } else if (selectedRoom.limit <= selectedRoom.players.length) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `La sala "${selectedRoom.name}" está llena.`
                });
        } else {
            selectedRoom.players.push(selectedUser);

            response.status(200).json(selectedRoom);
        }
    }
}

const removePlayer = async(request, response) => {
    const { roomId, userId } = request.body;

    let selectedRoom = rooms.find((room) => room.id === parseInt(roomId));
    let selectedUser = users.find((user) => user.id === parseInt(userId));

    if (!selectedRoom) {
        response
            .status(404)
            .json({ message: `La sala no existe.` });
    } else if (!selectedUser) {
        response
            .status(404)
            .json({ message: `El usuario no existe.` });
    } else {
        let newPlayers = selectedRoom.players.filter((player) => player.id !== selectedUser.id);
        selectedRoom.players = newPlayers;

        response.status(200).json(selectedRoom);
    }
}

module.exports.getRooms = getRooms;
module.exports.getRoom = getRoom;
module.exports.addPlayer = addPlayer;
module.exports.removePlayer = removePlayer;
