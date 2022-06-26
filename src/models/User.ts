import { Sequelize, DataTypes } from "sequelize";

export function User(sequelize: Sequelize) {
  const User = sequelize.define(
    'user',
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    }
  );

  return User;
}