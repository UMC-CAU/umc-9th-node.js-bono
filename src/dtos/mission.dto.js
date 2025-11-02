export const bodyToMission = (body) => {
  return {
    store_id: body.store_id,
    content: body.content,
    reward: body.reward,
    duedate: body.duedate,
  };
};

export const responseFromMission = (mission) => {
  return {
    id: mission.id,
    store_name: mission.name,
    content: mission.content,
    reward: mission.reward,
    duedate: mission.duedate,
  };
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
