export enum EventType {
  REVIEW = 'REVIEW'
}

export enum EventAction {
  ADD = 'ADD',
  MOD = 'MOD',
  DELETE = 'DELETE'
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
