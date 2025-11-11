import { prisma } from "../db.config.js";

export const addMission = async (data) => {
  try {
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
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const getMission = async (missionId) => {
  try {
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
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const setUserMissionInProgress = async (data) => {
  try {
    // 미션 존재여부 확인
    const mission = await prisma.mission.findUnique({
      where: { id: data.mission_id },
    });
    if (!mission) {
      throw new Error("존재하지 않는 미션입니다.", data);
    }

    // 유저 존재여부 확인
    const user = await prisma.user.findUnique({
      where: { id: data.user_id },
    });
    if (!user) {
      throw new Error("존재하지 않는 사용자입니다.", data);
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
      throw new Error("이미 진행중인 미션입니다.", data);
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
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const setUserMissionCompleted = async (userMissionId) => {
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
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const getUserMission = async (userMissionId) => {
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

export const getStoreMissions = async (storeId, cursor = 0) => {
  // 가게 존재하는지 확인
  const existingStore = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!existingStore) {
    return null; // 존재하지 않는 가게일 때
  }

  const missions = await prisma.mission.findMany({
    select: {
      id: true,
      store_id: true,
      content: true,
      reward: true,
      duedate: true,
      store: {
        select: {
          name: true,
        },
      },
    },
    where: {
      store_id: storeId,
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });

  return missions;
};

export const getMyUserMissionsInProgress = async (userId, cursor = 0) => {
  // 유저 존재하는지 확인
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    return null; // 존재하지 않는 유저일 때
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
