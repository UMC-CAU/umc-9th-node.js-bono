import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { storeSignUp } from "../services/store.service.js";

export const handleStoreSignUp = async (req: any, res: any, next: any) => {
  /*
    #swagger.summary = '가게 등록 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "홍길동" },
              region_id : {type:"option", example: "5"}
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "가게 등록 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  store_name: { type: "string", example: "맛밥" },
                  region_name: { type: "string", example: "서초구" }
                  
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "가게 등록 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S001" },
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
  console.log("가게 추가를 요청했습니다!"); //postman랑 어떻게 연결되는거지?
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const store = await storeSignUp(bodyToStore(req.body));
  res.status(StatusCodes.OK).success(store);
};
