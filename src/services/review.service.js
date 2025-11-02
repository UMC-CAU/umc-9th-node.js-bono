import { responseFromReview } from "../dtos/review.dto.js";
import { addReview, getReview } from "../repositories/review.repository.js";

export const reviewSignUp = async (data) => {
  const joinReviewId = await addReview({
    user_id: data.user_id,
    store_id: data.store_id,
    content: data.content,
    //created_at: data.created_at,
    rate: data.rate,
  });
  if (joinReviewId === null) {
    throw new Error("리뷰 추가에 실패했습니다.");
  }

  const review = await getReview(joinReviewId);
  return responseFromReview(review);
};
