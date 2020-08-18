const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
    const { id } = request.params;
    if (!isUuid(id)) {
        return response.status(400).json("Invalid ID.");
    }
    return next();
}

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;
    const repository = { id: uuid(), title, url, techs, likes: 0 };

    if (!title || !url || !techs) {
        return response.status(400).json("Not the expected data");
    }

    repositories.push(repository);

    return response.status(201).json(repository);
});

app.put("/repositories/:id", validateId, (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;
    const index = repositories.findIndex(repo => repo.id === id);

    if (index < 0) {
        return response.status(400).json("Repository Not Found");
    }

    if (!title || !url || !techs) {
        return response.json(repositories[index]);
    }

    const repository = { id, title, url, techs };
    const likes = repositories[index].likes;
    repositories[index] = { repository, likes };

    return response.json(repository);
});

app.delete("/repositories/:id", validateId, (request, response) => {
    const { id } = request.params;
    const index = repositories.findIndex(repo => repo.id === id);

    if (index < 0) {
        return response.status(400).json("Repository Not Found");
    }

    repositories.splice(index, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
    const { id } = request.params;
    const index = repositories.findIndex(repo => repo.id === id);

    if (index < 0) {
        return response.status(400).json("Repository Not Found");
    }

    repositories[index].likes++;

    return response.json(repositories[index]);
});

module.exports = app;