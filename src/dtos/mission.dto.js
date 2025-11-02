export const bodyToMission = (body) => {
  return {};
};

export const responseFromMission = (mission) => {
  return {};
};
export const bodyToUserMission = (body) => {
  return {
    user_id: body.user_id,
    mission_id: body.mission_id,
    status: body.status,
  };
};

export const responseFromUserMission = (mission) => {
  return {
    id: mission.id,
    user_id: mission.user_id,
    mission_id: mission.mission_id,
    status: mission.status,
  };
};
