import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import {
  reviewSignUp,
  listStoreReviews,
  listMyReviews,
} from "../services/review.service.js";

export const handleReviewSignUp = async (req: any, res: any, next: any) => {
  /* 
    #swagger.summary = '리뷰 추가 API';
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              user_id: { type: 'number', example: 1 },
              store_id: { type: 'number', example: 1 },
              content: { type: 'string', example: '맛있어요!' },
              rate: { type: 'number', example: 5 }
            },
            required: ['user_id', 'store_id', 'content', 'rate']
          }
        }
      }
    }
    #swagger.responses[200]={
    description: "리뷰 추가 성공 응답",
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
                      id: { type: "number", example: 1 },
                      user_id: { type: "number", example: 1 },
                      store_id: { type: "number", example: 1 },
                      content: { type: "string", example: "맛있어요!" },
                      created_at: { type: "string", format: "date-time", example: "2024-01-01T00:00:00.000Z" },
                      rate: { type: "number", example: 5 }
                    } 
                }
            }
        }
    } 
    #swagger.responses[400] = {
      description: "리뷰 등록 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "R001" },
                  reason: { type: "string" },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  const bodywithUserId = {
    ...req.body,
    user_id: req.user.id, // 로그인한 유저의 id로 덮어쓰기
  };
  console.log("리뷰 추가를 요청했습니다!");
  console.log("body:", bodywithUserId);

  const review = await reviewSignUp(bodyToReview(bodywithUserId));
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
    #swagger.responses[400] = {
      description: "가게 리뷰 조회 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "R002" },
                  reason: { type: "string" },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
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
  /* 
  
#swagger.summary = '나의 리뷰 목록 조회 API';
#swagger.security = [{ "bearerAuth": [] }]
#swagger.responses[200]={
    description: "나의 리뷰 목록 조회 성공 응답",
    content:{
        "application/json":{
            schema: {
                type: "object",
                properties:{
                  resultType: { type: "string", example: "SUCCESS" },
                  error:{ type : "object", nullable: true, example:null},
                  success:{ type : "object", nullable: true,
                    properties:{ 
                      data: { type : "array",
                        items: { type: "object",
                          properties:{ 
                            id : { type : "number", example: "1"},
                            content : { type: "string", example : "음식이 마싯어여"},
                            store_id : { type : "number", example: "1"},
                            user_id : { type : "number", example: "1"},
                            created_at : { type: "string", format: "date", example: "2025-11-06T18:12:10.869Z" },
                            rate: { type : "number", example: "1"},
                            store:{type:"object",
                              properties:{
                              name : { type : "string", example: "김밥천국"}
                            },
                            user:{type:"object",
                              properties:{
                              name : { type : "string", example: "김철수"}
                            }
                          }
                        }
                      },
                      pagination: { type : "object", 
                        properties: {
                          cursor: {type : "number", example: 12 }
                        }
                      }

                    
                    }

                  } 
                }
            }
        }
    } 
}

#swagger.responses[400] = {
      description: "나의 리뷰 조회 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "R003" },
                  reason: { type: "string" },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
*/

  console.log("나의 리뷰 목록 조회를 요청했습니다!");
  const reviews = await listMyReviews(
    parseInt(req.user.id),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(reviews);
};
