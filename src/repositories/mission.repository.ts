import { prisma } from "../db.config.js";
import {
  MissionSignUpRequest,
  MissionData,
  UserMissionRequest,
} from "../types/types";

export const addMission = async (
  data: MissionSignUpRequest
): Promise<null | number> => {
  // 가게 존재하는지 확인
  const existingStore = await prisma.store.findUnique({
    where: { id: data.store_id },
  });

  if (!existingStore) {
    return null;
  }

  const newMission = await prisma.mission.create({
    data: {
      store_id: data.store_id,
      content: data.content,
      reward: data.reward,
      duedate: data.duedate,
    },
  });

  return newMission.id;
};

export const getMission = async (
  missionId: number
): Promise<null | MissionData> => {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    include: {
      store: true,
    },
  });

  console.log(mission);

  if (!mission) {
    return null;
  }

  return {
    ...mission,
    ...mission.store,
  };
};

export const setUserMissionInProgress = async (data: UserMissionRequest) => {
  try {
    // 미션 존재여부 확인
    const mission = await prisma.mission.findUnique({
      where: { id: data.mission_id },
    });
    if (!mission) {
      throw new Error("존재하지 않는 미션입니다.");
    }

    // 유저 존재여부 확인
    const user = await prisma.user.findUnique({
      where: { id: data.user_id },
    });
    if (!user) {
      throw new Error("존재하지 않는 사용자입니다.");
    }

    // 이미 진행중인 미션인지 확인
    const existingUserMission = await prisma.user_mission.findFirst({
      where: {
        user_id: data.user_id,
        mission_id: data.mission_id,
        status: "IN_PROGRESS",
      },
    });

    if (existingUserMission) {
      throw new Error("이미 진행중인 미션입니다.");
    }

    const newUserMission = await prisma.user_mission.create({
      data: {
        user_id: data.user_id,
        mission_id: data.mission_id,
        status: "IN_PROGRESS",
      },
    });

    return newUserMission.id;
  } catch (err) {
    if (err instanceof Error) {
      // 에러 타입 지정해야 .message에 접근 가능
      if (err.message === "존재하지 않는 미션입니다.") {
        throw err; //그대로 던지기
      }
      if (err.message === "존재하지 않는 사용자입니다.") {
        throw err; //그대로 던지기
      }
      if (err.message === "이미 진행중인 미션입니다.") {
        throw err; //그대로 던지기
      }
    }
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const setUserMissionCompleted = async (userMissionId: number) => {
  try {
    // 유저미션 존재여부 확인
    const userMission = await prisma.user_mission.findUnique({
      where: {
        id: userMissionId,
      },
    });
    if (!userMission) {
      throw new Error("존재하지 않는 유저미션입니다.");
    }

    // 이미 완료된 미션인지 확인
    const completedUserMission = await prisma.user_mission.findFirst({
      where: {
        id: userMissionId,
        status: "COMPLETED",
      },
    });

    if (completedUserMission) {
      throw new Error("이미 완료된 미션입니다.");
    }

    const newUserMission = await prisma.user_mission.update({
      where: {
        id: userMission.id,
      },
      data: {
        status: "COMPLETED",
      },
    });

    return newUserMission.id;
  } catch (err) {
    //여기서 나는 에러는... err의 타입이 unknown이라서 .message에 접근할 수 없기 때문이란다..
    if (err instanceof Error) {
      //그래서 타입 지정.
      if (err.message === "존재하지 않는 유저미션입니다.") {
        throw err; //그대로 던지기
      }
      if (err.message === "이미 완료된 미션입니다.") {
        throw err; //그대로 던지기
      }
    }
    throw new Error( // 나머지 에러일 때만 이거 실행됨.
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const getUserMission = async (userMissionId: number) => {
  try {
    const userMission = await prisma.user_mission.findUnique({
      where: { id: userMissionId },
    });

    console.log(userMission);

    if (!userMission) {
      return null;
    }

    return userMission;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const getStoreMissions = async (
  storeId: number,
  cursor = 0
): Promise<null | MissionData[]> => {
  // 가게 존재하는지 확인
  const existingStore = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!existingStore) {
    return null; // 존재하지 않는 가게일 때
  }

  const missions = await prisma.mission.findMany({
    where: {
      store_id: storeId,
      id: { gt: cursor },
    },
    include: {
      store: true,
    },
    orderBy: { id: "asc" },
    take: 5, //엥? orderby랑 take는 요소로 안 치나? 타입이 달라도 오류가 안뜨네?
  });

  return missions;
};

export const getMyUserMissionsInProgress = async (
  userId: number,
  cursor = 0
) => {
  const isExistUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isExistUser) {
    return null; //->UserNotFoundError
  }

  const missions = await prisma.user_mission.findMany({
    select: {
      id: true,
      user_id: true,
      mission_id: true,
      status: true,
      updated_at: true,
      mission: {
        select: {
          content: true,
          reward: true,
          duedate: true,
          store: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    where: {
      user_id: userId,
      status: "IN_PROGRESS",
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });

  return missions;
};
