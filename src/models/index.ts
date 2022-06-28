import { DataTypes, Sequelize } from 'sequelize';

import config from './config';

export const sequelize = new Sequelize(
  config.db,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
    },
  },
);

export const AttachedPhoto = sequelize.define(
  'attachedPhoto',
  {
    attachedPhotoId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
  },
);

export const User = sequelize.define(
  'user',
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      unique: false,
    },
  },
);

export const Place = sequelize.define(
  'place',
  {
    placeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
  },
);

export const Review = sequelize.define(
  'review',
  {
    reviewId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'userId',
      },
    },
    placeId: {
      type: DataTypes.UUID,
      references: {
        model: Place,
        key: 'placeId',
      },
    },
  },
);

export const PointLog = sequelize.define(
  'pointLog',
  {
    pointLogId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    description: {
      type: DataTypes.STRING(400),
      allowNull: false,
      unique: false,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'userId',
      },
    },
    placeId: {
      type: DataTypes.UUID,
      references: {
        model: Place,
        key: 'placeId',
      },
    },
  },
);

export const ReviewHasAttachedPhoto = sequelize.define(
  'reviewHasAttachedPhoto',
  {
    reviewId: {
      type: DataTypes.UUID,
      references: {
        model: Review,
        key: 'reviewId',
      },
    },
    attachedPhotoId: {
      type: DataTypes.UUID,
      references: {
        model: AttachedPhoto,
        key: 'attachedPhotoId',
      },
    },
  },
);

export const db = {
  sequelize,
  User,
  Place,
  Review,
  AttachedPhoto,
  PointLog,
  ReviewHasAttachedPhoto,
};
