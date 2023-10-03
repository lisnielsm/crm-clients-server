const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const typeDefs = require("./db/schemas");
const resolvers = require("./db/resolvers");

const conectarDB = require("./config/db");

// Conectar a la base de datos
conectarDB();

// servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers['authorization'] || '';

        if (token) {
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);

                return {
                    usuario,
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
});

// arrancar el servidor
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
	console.log(`Servidor listo en la URL ${url}`);
});
