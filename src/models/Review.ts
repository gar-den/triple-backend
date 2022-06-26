import { DataTypes } from 'sequelize';

import { newSequelize } from './index';

function Review() {
  const Review = newSequelize.define(
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
      placeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
      },
    },
  );

  return Review;
}

export default Review;
