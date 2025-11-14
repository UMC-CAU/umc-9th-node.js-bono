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
import {
  MissionNotFoundError,
  UserNotFoundError,
  StoreNotFoundError,
  UserMissionNotFoundError,
  AlreadyInProgressError,
  AlreadyCompletedError,
} from "../errors.js";
import {
  MissionSignUpRequest,
  MissionData,
  UserMissionRequest,
} from "../types/types";

export const missionSignUp = async (data: MissionSignUpRequest) => {
  const joinMissionId = await addMission(data);
  if (joinMissionId === null) {
    throw new StoreNotFoundError("존재하지 않는 가게입니다.", data);
  }

  const mission = await getMission(joinMissionId);
  return responseFromMission(mission);
};

export const missionInProgress = async (data: UserMissionRequest) => {
  try {
    const userMissionId = await setUserMissionInProgress(data);
    /*
그럼 const userMissionId = await setUserMissionInProgress(data);
이거 실행할때 setUserMissionInProgress에서 throw error 하면 userMissionId에는 뭐가 담겨?

-> const userMissionId = await setUserMissionInProgress(data);
//                    ↑
//                    여기서 에러 발생 시 이 줄 자체가 실행 완료되지 않음! 
// 따라서 userMissionId에 할당이 안 되고, catch 블록을 찾아서 올라감. 
// 만약 catch가 없다면 missionInProgress 함수자체가 중단되고 missionInProgress를 호출한 controller 부분에다가 에러를 던지는거임 (throw err가 없어도)
// controller에도 catch가 없다면 그 다음은 express의 전역 에러 핸들러로 올라감. 아하!! 


*/
    if (userMissionId === null) {
      throw new Error("미션 진행에 실패했습니다."); //return null하는 경우가 없는데?
    }

    const userMission = await getUserMission(userMissionId);

    return responseFromUserMission(userMission);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "존재하지 않는 미션입니다.") {
        throw new MissionNotFoundError("존재하지 않는 미션입니다.", data);
      }
      if (err.message === "존재하지 않는 사용자입니다.") {
        throw new UserNotFoundError("존재하지 않는 사용자입니다.", data);
      }
      if (err.message === "이미 진행중인 미션입니다.") {
        throw new AlreadyInProgressError("이미 진행중인 미션입니다.", data);
      }
    }
    throw err; //다른 에러는 그대로 던지기
  }
};

export const missionComplete = async (user_mission_id: number) => {
  try {
    const userMissionId = await setUserMissionCompleted(user_mission_id);
    if (userMissionId === null) {
      //이럴경우가없는데?
      throw new Error("미션 완료에 실패했습니다.");
    }
    const userMission = await getUserMission(userMissionId);
    return responseFromUserMission(userMission);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "존재하지 않는 유저미션입니다.") {
        throw new UserMissionNotFoundError(
          "존재하지 않는 유저미션입니다.",
          user_mission_id
        );
      }
      if (err.message === "이미 완료된 미션입니다.") {
        throw new AlreadyCompletedError(
          "이미 완료된 미션입니다.",
          user_mission_id //여기서 userMission 쓰면 안되나? 네 안되네요
        );
      }
    }
    throw err; //다른 에러는 그대로 던지기
  }
};

export const listStoreMissions = async (storeId: number, cursor = 0) => {
  const missions = await getStoreMissions(storeId, cursor);
  if (missions === null) {
    throw new StoreNotFoundError("존재하지 않는 가게입니다.", storeId);
  }
  return responseFromMissions(missions);
};

export const listMyMissionsInProgress = async (userId: number, cursor = 0) => {
  const usermissions = await getMyUserMissionsInProgress(userId, cursor);
  if (usermissions === null) {
    throw new UserNotFoundError("존재하지 않는 사용자입니다.", userId);
  }
  return responseFromUserMissions(usermissions);
};
