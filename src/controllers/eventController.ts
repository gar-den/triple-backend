import { Request, Response } from 'express';

import { Model } from 'sequelize/types';
import {
  EventAction, EventType, ICreateEventInput, PointSortType, testInput,
} from '../interfaces/eventInterface';
import PointLogController from './pointLogController';
import {
  AttachedPhoto, Place, Review, ReviewHasAttachedPhoto, User,
} from '../models';

/*
해당 API는 review 자체를 생성, 수정, 삭제하지 않고,
생성, 수정, 삭제된 review를 참고하여 포인트를 계산하고 로그를 남기는 API이다.
*/
async function reviewEvent(data: ICreateEventInput) {
  const {
    userId, placeId, content, reviewId, attachedPhotoIds,
  } = data;
  let point = 0;
  let pointBefore = 0;

  if (data.action !== EventAction.DELETE) {
    const review = await Review.findOne({
      where: {
        reviewId,
      },
    });
    if (review === null) {
      return { errorMessage: 'no review found' };
    }

    pointBefore = review.getDataValue('point');

    // validation
    const reviewsExist = await Review.findAll({
      where: {
        userId,
        placeId,
      },
    });

    if (reviewsExist.length > 1) {
      return { errorMessage: 'already posted' };
    }

    // 포인트 계산
    // 1자 이상 텍스트 작성: 1점
    if (content.length > 0) {
      point += 1;
    }
    // 1장 이상 사진 첨부: 1점
    if (attachedPhotoIds.length > 0) {
      point += 1;
    }

    // 특정 장소에 첫 리뷰 작성: 1점
    const firstReviewOfPlace = await Review.findOne({
      where: {
        placeId,
      },
    });

    if (!!firstReviewOfPlace) {
      point += 1;
    }

    // 리뷰에 포인트 값 추가
    await review.update({
      point,
    }, {
      where: {
        reviewId,
      },
    });
  }

  const newPoint = point - pointBefore;

  await User.increment('point', {
    by: newPoint,
    where: {
      userId,
    },
  });

  // eventLog 생성
  const description = JSON.stringify(data);
  const pointLog = await PointLogController.createPoingLog({
    userId,
    placeId,
    description,
    point,
  });

  if (!!pointLog.errorMessage) {
    return { errorMessage: pointLog.errorMessage };
  }

  return { point };
}

const getPointByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findOne({
    where: {
      userId,
    },
  });

  if (user === null) {
    return res.json({ errorMessage: 'no user found' });
  }

  return res.json({ point: user.getDataValue('point') });
};

const getAllPoints = async (req: Request, res: Response) => {
  const { page, pageSize, sort } = req.query;

  const pageNumber = Number(page);
  const pageSizeNumber = Number(pageSize);

  const startData = pageSizeNumber * (pageNumber - 1) + 1;

  let item = 'point';
  let order = 'DESC';
  if (sort === PointSortType.POINT_DESC) {
    item = 'point';
    order = 'DESC';
  } else if (sort === PointSortType.POINT_ASC) {
    item = 'point';
    order = 'ASC';
  }

  const users = await User.findAll({
    order: [[item, order]],
  });

  const slicedUsers = users.slice(startData - 1, startData + pageSizeNumber - 1);

  return res.json({
    users: slicedUsers,
    page: pageNumber,
    pageSize: pageSizeNumber,
    totalSize: users.length,
  });
};

const createEvent = async (req: Request<{}, {}, ICreateEventInput>, res: Response) => {
  const { type } = req.body;

  if (type === EventType.REVIEW) {
    const response = await reviewEvent(req.body);

    if (!!response.errorMessage) {
      return res.status(400).json(response);
    }

    return res.json(response);
  }

  return res.json({ message: 'done' });
};

const scenario = async (req: Request<{}, {}, testInput>, res: Response) => {
  // 2 users
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

  res.json({ review });
};

export default {
  createEvent,
  getPointByUser,
  getAllPoints,
  scenario,
};
