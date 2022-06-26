import { DataTypes } from 'sequelize';

import { newSequelize } from './index';

function PointLog() {
  const PointLog = newSequelize.define(
    'pointLog',
    {
      pointLogId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      placeId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
    },
  );

  return PointLog;
}

export default PointLog;
