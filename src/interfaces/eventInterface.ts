/* eslint-disable no-unused-vars */
export enum EventType {
  REVIEW = 'REVIEW'
}

export enum EventAction {
  ADD = 'ADD',
  MOD = 'MOD',
  DELETE = 'DELETE'
}

export enum PointSortType {
  POINT_DESC = 'POINT_DESC',
  POINT_ASC = 'POINT_ASC',
}

export interface testInput {
  content: string,
}

export interface ICreateEventInput {
  type: EventType,
  action: EventAction,
  reviewId: string,
  content: string,
  attachedPhotoIds: string[],
  userId: string,
  placeId: string
}
