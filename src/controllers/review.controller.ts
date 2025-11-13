import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import {
  reviewSignUp,
  listStoreReviews,
  listMyReviews,
} from "../services/review.service.js";

export const handleReviewSignUp = async (req: any, res: any, next: any) => {
  console.log("리뷰 추가를 요청했습니다!");
  console.log("body:", req.body);

  const review = await reviewSignUp(bodyToReview(req.body));
  res.status(StatusCodes.OK).success(review);
};

export const handleListStoreReviews = async (req: any, res: any, next: any) => {
  console.log("가게 리뷰 목록 조회를 요청했습니다!");
  console.log("params:", req.params);
  console.log("query:", req.query);
  const reviews = await listStoreReviews(
    parseInt(req.params.storeId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(reviews);
};

export const handleListMyReviews = async (req: any, res: any, next: any) => {
  console.log("나의 리뷰 목록 조회를 요청했습니다!");
  const reviews = await listMyReviews(
    parseInt(req.params.userId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(reviews);
};
