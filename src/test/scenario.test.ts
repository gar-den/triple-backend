import iconv from 'iconv-lite';

import { Model } from 'sequelize/types';
import server from '../server';
import {
  AttachedPhoto, Place, Review, ReviewHasAttachedPhoto, sequelize, User,
} from '../models';

iconv.encodingExists('foo');

beforeAll(async () => {
  await server.initServer();
  await sequelize.sync({ force: true });
});

describe('event', () => {
  it('create event', async () => {
    const users: Model<any, any>[] = [];

    const user1 = await User.build({
      name: '김트리플',
    }).save();

    users.push(user1);

    const user2 = await User.build({
      name: '박트리플',
    }).save();

    users.push(user2);

    // 5 photos
    const attachedPhotoIds: Model<any, any>[] = [];

    for (let i = 0; i < 5; i++) {
      const attachedPhotoId = await AttachedPhoto.build({
        fileName: `fileName${i}`,
      }).save();

      attachedPhotoIds.push(attachedPhotoId);
    }

    // 2 places
    const places: Model<any, any>[] = [];

    const place1 = await Place.build({
      name: '남한산성',
    }).save();

    places.push(place1);

    const place2 = await Place.build({
      name: '강릉해수욕장',
    }).save();

    places.push(place2);

    const review = await Review.build({
      content: '최고에요',
      userId: users[0].getDataValue('userId'),
      placeId: places[0].getDataValue('placeId'),
    }).save();

    await ReviewHasAttachedPhoto.build({
      reviewId: review.getDataValue('reviewId'),
      attachedPhotoId: attachedPhotoIds[0].getDataValue('attachedPhotoId'),
    }).save();

    await ReviewHasAttachedPhoto.build({
      reviewId: review.getDataValue('reviewId'),
      attachedPhotoId: attachedPhotoIds[1].getDataValue('attachedPhotoId'),
    }).save();

    const reviews = await Review.findAll();
    expect(reviews.length).toBe(1);
  });
});
