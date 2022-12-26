import { buildSchema } from 'graphql';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';

// Data hårdkodad in vår kod istället för att hämta från en databas
//............//
export const flowers = [
    { id: 1, name: 'Bluebell', latin: "Hyacinthoides non-scripta"},
    { id: 2, name: 'Sweet Briar', latin: "Rosa rubiginosa"},
    { id: 3, name: 'Carnation', latin: "Dianthus caryophyllus"}
];

// Schema
//--------------------//
export const schema = buildSchema(`
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
//--------------------//

type Flower = {
    id: number;
    name: string;
    latin: string;
}
type FlowerInput = {
    id: number;
    name: string;
    latin: string;
}

// Resolver

const getFlower = (args: { id: number }): Flower | undefined => 
        flowers.find(flower => flower.id === args.id)

const getFlowers = (): Flower[] => flowers;

const createFlower = (args: { input: FlowerInput }): Flower => {
    const flower = { ...args.input };
    flowers.push(flower);
    return flower;
}

const updateFlower = (args: { id: number, input: FlowerInput }): Flower => {
    const index = flowers.findIndex(flower => flower.id === args.id);
    const targetFlower = flowers[index];

    if (targetFlower) flowers[index] = {...targetFlower, ...args.input};

    return targetFlower || {};
}

const root = {
    getFlower,
    getFlowers,
    createFlower,
    updateFlower,
}

// Server

const app = express();

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
)

const PORT = 3000;

app.listen(PORT)
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);