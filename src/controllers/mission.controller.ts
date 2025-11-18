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
  console.log("미션 진행 요청을 받았습니다!");
  console.log("body:", req.body);

  const mission = await missionInProgress(bodyToUserMission(req.body));
  res.status(StatusCodes.OK).success(mission);
};
export const handleUserMissionUpdateCompleted = async (
  req: any,
  res: any,
  next: any
) => {
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
  console.log("나의 진행중인 미션 목록 조회를 요청했습니다!");
  console.log("params:", req.params);
  console.log("query:", req.query);
  const missions = await listMyMissionsInProgress(
    parseInt(req.params.userId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(missions);
};
