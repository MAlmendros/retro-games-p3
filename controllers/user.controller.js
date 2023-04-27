const { users } = require("../data/user.data");

const login = async(request, response) => {
    const userData = request.body;

    if (!userData || !userData.email || !userData.password) {
        response
            .status(404)
            .json({ message: `Fill in all fields.` });
    } else {
        let selectedUser = users.find((user) => user.email === userData.email && user.password === userData.password);

        if (!selectedUser) {
            response
                .status(404)
                .json({ message: `User with email ${userData.email} not found or password incorrect.` });
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
            .json({ message: `User with id ${id} not found.` });
    }
}

const createUser = async(request, response) => {
    const newUser = request.body;

    let selectedUser = users.find((user) => user.email === newUser.email);

    if (selectedUser) {
        response
            .status(404)
            .json({ message: `This email is already registered.` });
    } else {
        const ids = users.map((user) => user.id);
        let id = Math.max(...ids) + 1;

        newUser.id = id;
        users.push(newUser);

        response.status(200).json(newUser);
    }
}

module.exports.login = login;
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.createUser = createUser;
