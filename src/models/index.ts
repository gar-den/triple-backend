import { Op, Sequelize } from "sequelize";

import config from "./config";
import { Place } from "./Place";
import { Review } from "./Review";
import { User } from "./User";
import { AttachedPhoto } from "./AttachedPhoto";
import { PointLog } from "./PointLog";

export const newSequelize = new Sequelize(
  config.db,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
    // operatorsAliases: {
    //   $and: Op.and,
    //   $or: Op.or,
    //   $eq: Op.eq,
    //   $gt: Op.gt,
    //   $lt: Op.lt,
    //   $lte: Op.lte,
    //   $like: Op.like
    // },
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },
  },
);

const user = User();
const place = Place();
const review = Review();
const attachedPhoto = AttachedPhoto();
const pointLog = PointLog();

review.hasOne(user);
review.hasOne(place);
review.hasMany(attachedPhoto);

pointLog.hasOne(user);
pointLog.hasOne(place);

export const db = {
  newSequelize,
  user,
  place,
  review,
  attachedPhoto,
  pointLog,
};
