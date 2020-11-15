import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { ApolloServer, gql } from "apollo-server";
import { resolvers } from "./apolloServer/resolvers/resolvers";

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: gql`
    ${fs.readFileSync(__dirname.concat("/apolloServer/schema.graphql"))}
  `,
  resolvers,
  context: (request) => {
    return {
      req: request,
      prisma,
    };
  },
});

server.listen().then((res) => {
  console.log(
    `Apollo Server is listening on port http://localhost:${res.port}`
  );
});
