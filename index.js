"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.flowers = void 0;
const graphql_1 = require("graphql");
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
// Data hårdkodad in vår kod istället för att hämta från en databas
//............//
exports.flowers = [
    { id: 1, name: 'Bluebell', latin: "Hyacinthoides non-scripta" },
    { id: 2, name: 'Sweet Briar', latin: "Rosa rubiginosa" },
    { id: 3, name: 'Carnation', latin: "Dianthus caryophyllus" }
];
// Schema
//--------------------//
exports.schema = (0, graphql_1.buildSchema)(`
    type Query {
        getFlower(id: Int!): Flower
        getFlowers: [Flower]
    }

    type Flower {
        id: Int!
        name: String!
        latin: String!
    }

    input FlowerInput {
        id: Int!
        name: String!
        latin: String!
    }

    type Mutation {
        createFlower(input: FlowerInput): Flower
        updateFlower(id: Int!, input: FlowerInput): Flower
    }
`);
// Resolver
const getFlower = (args) => exports.flowers.find(flower => flower.id === args.id);
const getFlowers = () => exports.flowers;
const createFlower = (args) => {
    const flower = Object.assign({}, args.input);
    exports.flowers.push(flower);
    return flower;
};
const updateFlower = (args) => {
    const index = exports.flowers.findIndex(flower => flower.id === args.id);
    const targetFlower = exports.flowers[index];
    if (targetFlower)
        exports.flowers[index] = Object.assign(Object.assign({}, targetFlower), args.input);
    return targetFlower || {};
};
const root = {
    getFlower,
    getFlowers,
    createFlower,
    updateFlower,
};
// Server
const app = (0, express_1.default)();
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: exports.schema,
    rootValue: root,
    graphiql: true,
}));
const PORT = 3000;
app.listen(PORT);
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
