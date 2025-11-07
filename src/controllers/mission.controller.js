import { StatusCodes } from "http-status-codes";
import { bodyToMission, bodyToUserMission } from "../dtos/mission.dto.js";
import {
  missionSignUp,
  missionInProgress,
  listStoreMissions,
} from "../services/mission.service.js";

export const handleMissionSignUp = async (req, res, next) => {
  console.log("미션 추가를 요청했습니다!");
  console.log("body:", req.body);

  const mission = await missionSignUp(bodyToMission(req.body));
  res.status(StatusCodes.OK).json({ result: mission });
};

export const handleMissionInProgress = async (req, res, next) => {
  console.log("미션 진행 요청을 받았습니다!");
  console.log("body:", req.body);

  const mission = await missionInProgress(bodyToUserMission(req.body));
  res.status(StatusCodes.OK).json({ result: mission });
};

export const handleListStoreMissions = async (req, res, next) => {
  console.log("가게 미션 목록 조회를 요청했습니다!");
  console.log("params:", req.params);
  console.log("query:", req.query);
  const missions = await listStoreMissions(
    parseInt(req.params.storeId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).json(missions);
};
