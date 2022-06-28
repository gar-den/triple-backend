import { ICreatePoingLogInput } from '../interfaces/pointLogInterface';
import { Place, PointLog, User } from '../models';

const createPoingLog = async (data: ICreatePoingLogInput) => {
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

  console.log('pointLog:', pointLog);

  return { pointLog };
};

export default {
  createPoingLog,
};
