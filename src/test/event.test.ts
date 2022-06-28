import request from 'supertest';
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
  const users: Model<any, any>[] = [];
  const attachedPhotoIds: Model<any, any>[] = [];
  const places: Model<any, any>[] = [];
  const reviews: Model<any, any>[] = [];

  it('create data', async () => {
    /*
    User, AttachedPhoto, Place, Review 생성에 관한 API는 과제 내용에 적혀 있지 않아 하드코딩으로 넣습니다.
    */
    const user1 = await User.build({
      name: '김트리플',
    }).save();

    users.push(user1);

    const user2 = await User.build({
      name: '박트리플',
    }).save();

    users.push(user2);

    // 5 photos
    for (let i = 0; i < 5; i++) {
      const attachedPhotoId = await AttachedPhoto.build({
        fileName: `fileName${i}`,
      }).save();

      attachedPhotoIds.push(attachedPhotoId);
    }

    // 2 places
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

    reviews.push(review);

    await ReviewHasAttachedPhoto.build({
      reviewId: review.getDataValue('reviewId'),
      attachedPhotoId: attachedPhotoIds[0].getDataValue('attachedPhotoId'),
    }).save();

    await ReviewHasAttachedPhoto.build({
      reviewId: review.getDataValue('reviewId'),
      attachedPhotoId: attachedPhotoIds[1].getDataValue('attachedPhotoId'),
    }).save();

    const reviewList = await Review.findAll();
    expect(reviewList.length).toBe(1);
  });

  /*
    실제 테스트 코드
    */
  it('create event', async () => {
    const { app } = server;

    const res1 = await request(app).post('/events').send({
      type: 'REVIEW',
      action: 'ADD',
      reviewId: reviews[0].getDataValue('reviewId'),
      content: '최고에요',
      attachedPhotoIds: [
        attachedPhotoIds[0].getDataValue('attachedPhotoId'),
        attachedPhotoIds[1].getDataValue('attachedPhotoId'),
      ],
      userId: users[0].getDataValue('userId'),
      placeId: places[0].getDataValue('placeId'),
    });

    expect(res1.statusCode).toBe(200);
    expect(res1.body.point).toBe(3);

    await Review.update({
      content: '',
    }, {
      where: {
        reviewId: reviews[0].getDataValue('reviewId'),
      },
    });

    const res2 = await request(app).post('/events').send({
      type: 'REVIEW',
      action: 'MOD',
      reviewId: reviews[0].getDataValue('reviewId'),
      content: '',
      attachedPhotoIds: [
        attachedPhotoIds[0].getDataValue('attachedPhotoId'),
        attachedPhotoIds[1].getDataValue('attachedPhotoId'),
      ],
      userId: users[0].getDataValue('userId'),
      placeId: places[0].getDataValue('placeId'),
    });

    expect(res2.statusCode).toBe(200);
    expect(res2.body.point).toBe(2);

    // 이미 리뷰가 1개 이상 작성된 장소에 대한 리뷰 작성
    const newReview = await Review.build({
      content: '저는 경치가 별로였어요.',
      userId: users[1].getDataValue('userId'),
      placeId: places[0].getDataValue('placeId'),
    }).save();

    const res3 = await request(app).post('/events').send({
      type: 'REVIEW',
      action: 'ADD',
      reviewId: newReview.getDataValue('reviewId'),
      content: '저는 경치가 별로였어요.',
      attachedPhotoIds: [],
      userId: users[1].getDataValue('userId'),
      placeId: places[0].getDataValue('placeId'),
    });

    expect(res3.statusCode).toBe(200);
    expect(res3.body.point).toBe(1);

    /*
    포인트가 많은 순으로 리스팅 되는지 테스트
    */
    const res4 = await request(app).get('/events/point/list?page=1&pageSize=5&sort=POINT_DESC');

    expect(res4.statusCode).toBe(200);
    expect(res4.body.users.length).toBe(2);
    expect(res4.body.users[0].point > res4.body.users[1].point).toBeTruthy();
  });
});
