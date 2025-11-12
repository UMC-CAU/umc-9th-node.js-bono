interface MissionSignUpRequest {
  store_id: number;
  content: string;
  reward: number;
  duedate: Date;
}

interface MissionSignUpResponse {
  id: number;
  store_name: string;
  content: string;
  reward: number;
  duedate: Date;
}

interface UserMissionRequest {
  user_id: number;
  mission_id: number;
  status: string;
}

interface UserMissionResponse {
  id: number;
  user_id: number;
  mission_id: number;
  status: string;
}

interface MissionsResponse {
  data: MissionSignUpResponse[];
  pagination: {
    cursor: number | null;
  };
}

interface UserMissionsResponse {
  data: UserMissionResponse[];
  pagination: {
    cursor: number | null;
  };
}
export const bodyToMission = (body: any): MissionSignUpRequest => {
  const duedate = new Date(body.duedate);

  return {
    store_id: body.store_id,
    content: body.content,
    reward: body.reward,
    duedate: duedate,
  };
};

export const responseFromMission = (mission: any): MissionSignUpResponse => {
  return {
    id: mission.id,
    store_name: mission.name,
    content: mission.content,
    reward: mission.reward,
    duedate: mission.duedate,
  };
};
export const bodyToUserMission = (body: any): UserMissionRequest => {
  // 없는걸 생성하면 id가 없고, 있는걸 조회할땐 id가 있다. -> 없는거 생성할때만 dto 쓰고 있는 거 조회할때는 그냥 생으로 usermission_id 쓰면 안되나?
  return {
    user_id: body.user_id,
    mission_id: body.mission_id,
    status: body.status,
  };
};

export const responseFromUserMission = (mission: any): UserMissionResponse => {
  return {
    id: mission.id,
    user_id: mission.user_id,
    mission_id: mission.mission_id,
    status: mission.status,
  };
};

export const responseFromMissions = (missions: any[]): MissionsResponse => {
  return {
    data: missions,
    pagination: {
      cursor: missions.length ? missions[missions.length - 1].id : null,
    },
  };
};

export const responseFromUserMissions = (
  missions: any[]
): UserMissionsResponse => {
  return {
    data: missions,
    pagination: {
      cursor: missions.length ? missions[missions.length - 1].id : null,
    },
  };
};
