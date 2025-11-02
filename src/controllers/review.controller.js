import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { reviewSignUp } from "../services/review.service.js";

export const handleReviewSignUp = async (req, res, next) => {
  console.log("리뷰 추가를 요청했습니다!");
  console.log("body:", req.body);

  const review = await reviewSignUp(bodyToReview(req.body));
  res.status(StatusCodes.OK).json({ result: review });
};
