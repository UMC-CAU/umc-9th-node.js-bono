import { responseFromReview } from "../dtos/review.dto.js";
import { addReview, getReview } from "../repositories/review.repository.js";
import { responseFromReviews } from "../dtos/review.dto.js";
import {
  getAllStoreReviews,
  getAllUserReviews,
} from "../repositories/review.repository.js";

export const reviewSignUp = async (data) => {
  const joinReviewId = await addReview({
    user_id: data.user_id,
    store_id: data.store_id,
    content: data.content,
    //created_at: data.created_at, 이건 db에서 자동 생성
    rate: data.rate,
  });
  if (joinReviewId === null) {
    throw new Error("리뷰 추가에 실패했습니다.");
  }

  const review = await getReview(joinReviewId);
  return responseFromReview(review);
};

export const listStoreReviews = async (storeId, cursor = 0) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

export const listMyReviews = async (userId, cursor = 0) => {
  const reviews = await getAllUserReviews(userId, cursor);
  return responseFromReviews(reviews);
};
