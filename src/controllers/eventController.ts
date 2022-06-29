import { Request, Response } from 'express';

import {
  EventAction, EventType, ICreateEventInput, PointSortType,
} from '../interfaces/eventInterface';
import PointLogController from './pointLogController';
import { Review, User } from '../models';

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
    const reviewOfPlace = await Review.findAll({
      where: {
        placeId,
      },
    });

    if (reviewOfPlace.length === 1 && reviewOfPlace[0].getDataValue('reviewId') === reviewId) {
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
  const pointLog = await PointLogController.createPointLog({
    userId,
    placeId,
    description,
    point: newPoint,
  });

  if (!!pointLog.errorMessage) {
    return { errorMessage: pointLog.errorMessage };
  }

  return { pointLog: pointLog.pointLog, point };
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

export default {
  createEvent,
  getPointByUser,
  getAllPoints,
};
