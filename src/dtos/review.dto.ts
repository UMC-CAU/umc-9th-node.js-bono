import { ReviewSignUpRequest, ReviewData, ReviewsData } from "../types/types";

export const bodyToReview = (body: any): ReviewSignUpRequest => {
  return {
    user_id: body.user_id,
    store_id: body.store_id,
    content: body.content,
    rate: body.rate,
  };
};

export const responseFromReview = (review: ReviewData) => {
  return {
    id: review.id,
    user_id: review.user_id,
    store_id: review.store_id,
    content: review.content,
    created_at: review.created_at,
    rate: review.rate,
    store_name: review.store?.name, // ← 평면으로 변환
    user_name: review.user?.name, // ← 평면으로 변환
  };
};

export const responseFromReviews = (reviews: ReviewData[]): ReviewsData => {
  return {
    data: reviews, // 변환 없이 그대로 반환
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};
