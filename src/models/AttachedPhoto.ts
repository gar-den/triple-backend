import { DataTypes } from 'sequelize';

import { newSequelize } from './index';

function AttachedPhoto() {
  const AttachedPhoto = newSequelize.define(
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

  return AttachedPhoto;
}

export default AttachedPhoto;
