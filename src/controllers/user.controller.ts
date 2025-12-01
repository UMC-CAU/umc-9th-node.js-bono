import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp, updateUserProfile } from "../services/user.service.js";

export const handleUserSignUp = async (req: any, res: any, next: any) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", example: "user@example.com" },
              name: { type: "string", example: "홍길동" },
              gender: { type: "string", example: "여성" },
              birth: { type: "string", format: "date", example: "2000-01-01" },
              address: { type: "string", example: "서울시 동작구" },
              detailAddress: { type: "string", example: "상도동 123-45" },
              phoneNumber: { type: "string", example: "010-1234-5678" },
              password: { type: "string", example: "password123" },
              preferences: { type: "array", items: { type: "number" } , example: [1, 2, 3] }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공 응답",
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
                  name: { type: "string", example: "홍길동" },
                  gender: { type: "string", example: "여성" },
                  birth: { type: "string", format: "date", example: "2000-01-01" },
                  address: { type: "string", example: "서울시 동작구" },
                  detailAddress: { type: "string", example: "상도동 123-45" },
                  phoneNumber: { type: "string", example: "010-1234-5678" },
                  password: { type: "string", example: "password123" },
                  preferences: { type: "array", items: { type: "number" }, example: [1, 2, 3] }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "회원 가입 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
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
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));

  res.status(StatusCodes.OK).success(user);
};

export const handleProfileEdit = async (req: any, res: any, next: any) => {
  /*
    #swagger.summary = '회원 프로필 수정 API';
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "홍길동" },
              address: { type: "string", example: "서울시 동작구" },
              detailAddress: { type: "string", example: "상도동 123-45" },
              phoneNumber: { type: "string", example: "010-1234-5678" }
            }
          }
        }
      }
    };
  */
  console.log("프로필 수정을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
  console.log("user:", req.user); // 인증 미들웨어에서 추가된 사용자 정보

  const updatedUser = await updateUserProfile(req.user.id, req.body);

  res.status(StatusCodes.OK).success({
    message: "프로필이 성공적으로 수정되었습니다.",
    user: updatedUser,
  });
};
