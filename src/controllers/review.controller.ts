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
  /* 
    #swagger.summary = '가게 리뷰 목록 조회 API';
    #swagger.responses[200]={
    description: "가게 리뷰 목록 조회 성공 응답",
    content:{
        "application/json":{
            schema: {
                type: "object",
                properties:{
                  resultType: { type: "string", example: "SUCCESS" },
                  error:{
                    type:"object", nullable:true, example:null},
                  success:{
                    type:"object",
                    properties:{
                      data:{ type:"array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          content: { type: "string" },
                          store_id: { type: "number" },
                          user_id: { type: "number" },
                          created_at: { type: "string", format: "date-time" },
                          rate: { type: "number" },
                          store:{
                            type: "object",
                            properties:{
                              name: { type: "string" },
                            },
                          },
                          user:{
                            type: "object",
                            properties:{
                              name: { type: "string" },
                            },
                          },
                        }
                      },
                      pagination:{ type:"object", 
                        properties:{
                          cursor:{ type:"number"}
                        }
                      }
                    } 
                }
            }
        }
    }
  */
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
