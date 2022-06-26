import { DataTypes } from 'sequelize';

import { newSequelize } from './index';

function User() {
  const User = newSequelize.define(
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
    },
  );

  return User;
}

export default User;
