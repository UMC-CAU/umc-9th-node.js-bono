import {
  responseFromMission,
  responseFromUserMission,
} from "../dtos/mission.dto.js";
import {
  addMission,
  getMission,
  setUserMissionInProgress,
  getUserMission,
} from "../repositories/mission.repository.js";

export const missionSignUp = async (data) => {
  const joinMissionId = await addMission({});
  if (joinMissionId === null) {
    throw new Error("이미 존재하는 미션입니다.");
  }

  const mission = await getMission(joinMissionId);
  return responseFromMission(mission);
};

export const missionInProgress = async (data) => {
  const userMissionId = await setUserMissionInProgress(data);

  if (userMissionId === null) {
    throw new Error("미션 진행에 실패했습니다.");
  }

  const userMission = await getUserMission(userMissionId);

  return responseFromUserMission(userMission);
};
