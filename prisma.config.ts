require("dotenv").config();

const config = {
  schema: "./prisma/schema.prisma",
  datasource: {
    db: {
      provider: "sqlite",
      url: process.env.DATABASE_URL,
    },
  },
};

export default config;
