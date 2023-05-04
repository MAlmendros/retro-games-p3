const { users } = require("../data/user.data");

const login = async(request, response) => {
    const userData = request.body;

    if (!userData || !userData.email || !userData.password) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Rellene todos los datos.`
            });
    } else {
        let selectedUser = users.find((user) => user.email === userData.email && user.password === userData.password);

        if (!selectedUser) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El usuario con correo electrónico "${userData.email}" no existe o la contraseña es incorrecta.`
                });
        } else {
            response.status(200).json(selectedUser);
        }
    }
}

const getUsers = async(request, response) => {
    response.status(200).json(users);
}

const getUser = async(request, response) => {
    const id = request.params.id;

    const selectedUser = users.find((user) => user.id === parseInt(id));

    if (selectedUser) {
        response.status(200).json(selectedUser);
    } else {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario no existe.`
            });
    }
}

const createUser = async(request, response) => {
    let newUser = request.body;

    let selectedUser = users.find((user) => user.email === newUser.email);

    if (selectedUser) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Este correo electrónico ya está registrado.`
            });
    } else if (!newUser || !newUser.avatar || !newUser.email || !newUser.username || !newUser.password) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Rellene todos los datos.`
            });
    } else {
        const ids = users.map((user) => user.id);
        let id = Math.max(...ids) + 1;

        newUser = {
            id,
            ...newUser,
            room: {}
        };
        users.push(newUser);

        response.status(200).json(newUser);
    }
}

module.exports.login = login;
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.createUser = createUser;
