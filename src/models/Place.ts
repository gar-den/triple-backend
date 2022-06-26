import { DataTypes } from "sequelize";

import { newSequelize } from "./index";

export function Place() {
  const Place = newSequelize.define(
    'place',
    {
      placeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
    }
  );

  return Place;
}