import { StatusCodes } from "http-status-codes";
import { bodyToMission, bodyToUserMission } from "../dtos/mission.dto.js";
import {
  missionSignUp,
  missionInProgress,
  missionComplete,
  listStoreMissions,
  listMyMissionsInProgress,
} from "../services/mission.service.js";

export const handleMissionSignUp = async (req: any, res: any, next: any) => {
  /*
    #swagger.summary = '미션 추가 API';
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              store_id: { type: 'number', example: 1 },
              content: { type: 'string', example: '치킨 2마리 주문하기' },
              reward: { type: 'number', example: 500 },
              duedate: {type:'string', format: 'date', example:"2025-12-13"}
            },
            required: [ 'store_id', 'content', 'reward', 'duedate']
          }
        }
      }
    }
    #swagger.responses[200]={
    description: "미션 추가 성공 응답",
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
                      store_name: { type: "string", example: 김밥천국 },
                      content: { type: "string", example: "맛있어요!" },
                      reward: { type: "number", example: 500 },
                      duedate: { type: "string", format: "date", example: "2024-11-01" },
                    } 
                }
            }
        }
    } 
    #swagger.responses[400] = {
      description: "미션 등록 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M001" },
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
  console.log("미션 추가를 요청했습니다!");
  console.log("body:", req.body);

  const mission = await missionSignUp(bodyToMission(req.body));
  res.status(StatusCodes.OK).success(mission);
};

export const handleUserMissionUpdateInProgress = async (
  req: any,
  res: any,
  next: any
) => {
  /*
  
    #swagger.summary = '미션 진행중으로 변경 (유저미션 추가) API';
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              mission_id : { type: 'number', example: 1 },
            },
            required: ['mission_id']
          }
        }
      }
    }
    #swagger.responses[200]={
    description: "미션 진행중으로 변경 (유저미션 추가) 성공 응답",
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
                      user_id: { type: "number", example: 2 },
                      mission_id : { type: "number", example: 2 },
                      status : {type: "string", example:"IN_PROGRESS"}
                    } 
                }
            }
        }
    } 
    #swagger.responses[400] = {
      description: "미션 진행중으로 변경 (유저미션 추가) 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M002" },
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
  console.log("미션 진행 요청을 받았습니다!");
  console.log("body:", bodywithUserId);

  const mission = await missionInProgress(bodyToUserMission(bodywithUserId));
  res.status(StatusCodes.OK).success(mission);
};
export const handleUserMissionUpdateCompleted = async (
  req: any,
  res: any,
  next: any
) => {
  /*
    #swagger.summary = '미션 완료로 변경 API';
    #swagger.responses[200]={
    description: "미션 완료로 변경 성공 응답",
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
                      user_id: { type: "number", example: 2 },
                      mission_id : { type: "number", example: 2 },
                      status : {type: "string", example:"COMPLETED"}
                    } 
                }
            }
        }
    } 
    #swagger.responses[400] = {
      description: "미션 완료로 변경 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M003" },
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
  console.log("미션 완료 요청을 받았습니다!");
  console.log("params:", req.params);

  const mission = await missionComplete(
    //dto 안 씀.
    parseInt(req.params.user_mission_id) //user_mission_id할까 그냥 id 할까?
  );
  res.status(StatusCodes.OK).success(mission);
};
export const handleListStoreMissions = async (
  req: any,
  res: any,
  next: any
) => {
  /* 
    #swagger.summary = '가게 미션 목록 조회 API';
    #swagger.responses[200]={
    description: "가게 미션 목록 조회 성공 응답",
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
                          store_id: { type: "number" },
                          content: { type: "string" },             
                          reward: {type:"number"},             
                          duedate: { type: "string", format: "date" },
                          store:{
                            type: "object",
                            properties:{
                              name: { type: "string" },
                              id: { type: "number" },
                              region_id: { type: "number" },
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
                  errorCode: { type: "string", example: "M003" },
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
  console.log("가게 미션 목록 조회를 요청했습니다!");
  console.log("params:", req.params);
  console.log("query:", req.query);
  const missions = await listStoreMissions(
    parseInt(req.params.storeId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(missions);
};

export const handleListMyMissionsInProgress = async (
  req: any,
  res: any,
  next: any
) => {
  /* 
  
#swagger.summary = '나의 진행중인 미션 목록 조회 API';
#swagger.security = [{ "bearerAuth": [] }]
#swagger.responses[200]={
    description: "나의 진행중인 미션 목록 조회 성공 응답",
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
                            user_id : { type : "number", example: "1"},
                            mission_id : { type : "number", example: "1"},
                            status: {type:"string", example:"IN_PROGRESS"}
                            updated_at : { type: "string", format: "date", example: "2025-11-06" },
                            mission:{ type:"object",
                              properties:{
                              content : { type : "string", example: " 김밥 5개 이상 주문하기 "},
                              reward : {type:"number",example:"400"},
                              duedate:{type:"string",format: "date_time", example: "2025-12-31T00:00:00.000Z" },
                              store:{ type : "object",
                                properties: {
                                name : { type : "string", example: "김밥천국"}
                              }
                            },
                            
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
      description: "나의 진행중인 미션 조회 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M004" },
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
  console.log("나의 진행중인 미션 목록 조회를 요청했습니다!");
  console.log("params:", req.params);
  console.log("query:", req.query);
  const missions = await listMyMissionsInProgress(
    parseInt(req.user.id),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(missions);
};
