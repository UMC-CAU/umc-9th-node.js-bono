import {
  responseFromMission,
  responseFromUserMission,
  responseFromMissions,
  responseFromUserMissions,
} from "../dtos/mission.dto.js";
import {
  addMission,
  getMission,
  setUserMissionInProgress,
  setUserMissionCompleted,
  getUserMission,
  getStoreMissions,
  getMyUserMissionsInProgress,
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

export const missionComplete = async (user_mission_id) => {
  const userMissionId = await setUserMissionCompleted(user_mission_id);
  if (userMissionId === null) {
    throw new Error("미션 완료에 실패했습니다.");
  }
  const userMission = await getUserMission(userMissionId);
  return responseFromUserMission(userMission);
};

export const listStoreMissions = async (storeId, cursor = 0) => {
  const missions = await getStoreMissions(storeId, cursor);
  return responseFromMissions(missions);
};

export const listMyMissionsInProgress = async (userId, cursor = 0) => {
  const missions = await getMyUserMissionsInProgress(userId, cursor);
  return responseFromUserMissions(missions);
};
