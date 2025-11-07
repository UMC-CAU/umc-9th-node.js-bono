import {
  responseFromMission,
  responseFromUserMission,
  responseFromMissions,
} from "../dtos/mission.dto.js";
import {
  addMission,
  getMission,
  setUserMissionInProgress,
  getUserMission,
  getStoreMissions,
} from "../repositories/mission.repository.js";

export const missionSignUp = async (data) => {
  const joinMissionId = await addMission(data);
  if (joinMissionId === null) {
    throw new Error("존재하지 않는 가게입니다.");
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

export const listStoreMissions = async (storeId, cursor = 0) => {
  const missions = await getStoreMissions(storeId, cursor);
  return responseFromMissions(missions);
};
