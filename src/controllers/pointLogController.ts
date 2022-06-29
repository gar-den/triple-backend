import { ICreatePointLogInput } from '../interfaces/pointLogInterface';
import { Place, PointLog, User } from '../models';

const createPointLog = async (data: ICreatePointLogInput) => {
  const {
    userId, placeId, point, description,
  } = data;

  const user = await User.findOne({
    where: {
      userId,
    },
  });

  if (user === null) {
    return { errorMessage: 'no user found' };
  }

  const place = await Place.findOne({
    where: {
      placeId,
    },
  });

  if (place === null) {
    return { errorMessage: 'no place found' };
  }

  const pointLog = await PointLog.build({
    userId, placeId, point, description,
  }).save();

  return { pointLog };
};

export default {
  createPointLog,
};
