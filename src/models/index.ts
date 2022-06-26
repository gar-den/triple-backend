import { Sequelize, Op } from "sequelize";

import config from "./config";
import { User } from "./User";

const sequelize = new Sequelize(
  config.db,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
    operatorsAliases: {
      $and: Op.and,
      $or: Op.or,
      $eq: Op.eq,
      $gt: Op.gt,
      $lt: Op.lt,
      $lte: Op.lte,
      $like: Op.like
    },
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {
  sequelize,
  user: User(sequelize)
};

export default db;