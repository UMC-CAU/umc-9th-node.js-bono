import { responseFromReview } from "../dtos/review.dto.js";
import { addReview, getReview } from "../repositories/review.repository.js";
import { responseFromReviews } from "../dtos/review.dto.js";
import {
  getStoreReviews,
  getUserReviews,
} from "../repositories/review.repository.js";

import {
  UserNotFoundError,
  StoreNotFoundError,
  ReviewNotFoundError,
} from "../errors.js";

export const reviewSignUp = async (data: any) => {
  const joinReviewId = await addReview({
    user_id: data.user_id,
    store_id: data.store_id,
    content: data.content,
    //created_at: data.created_at, 이건 db에서 자동 생성
    rate: data.rate,
  });
  if (joinReviewId === null) {
    throw new StoreNotFoundError("존재하지 않는 가게입니다.", data);
  }
  const review = await getReview(joinReviewId);

  if (review === null) {
    throw new ReviewNotFoundError(
      "리뷰 생성 후 조회에 실패했습니다.",
      joinReviewId
    );
  } //null일 경우를 여기서 걸러줘야 👇🏼 에서 에러 안 남.
  return responseFromReview(review);
};

export const listStoreReviews = async (storeId: number, cursor = 0) => {
  const reviews = await getStoreReviews(storeId, cursor);

  if (reviews === null) {
    throw new StoreNotFoundError("존재하지 않는 가게입니다.", storeId);
  }
  return responseFromReviews(reviews);
};

export const listMyReviews = async (userId: number, cursor = 0) => {
  // 스토어 상관 없이 내가 쓴 모든 리뷰
  const reviews = await getUserReviews(userId, cursor);
  if (reviews === null) {
    throw new UserNotFoundError("존재하지 않는 유저입니다.", userId);
  }
  return responseFromReviews(reviews);
};
