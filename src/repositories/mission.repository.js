import { pool } from "../db.config.js";

export const addMission = async (data) => {};

export const getMission = async (missionId) => {};

export const setUserMissionInProgress = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [confirmmission] = await conn.query(
      //미션존재여부
      "SELECT id FROM mission WHERE id = ?",
      [data.mission_id]
    );
    if (confirmmission.length === 0) {
      throw new Error("존재하지 않는 미션입니다.");
    }

    const [confirmuser] = await conn.query(
      //유저존재여부
      "SELECT id FROM `user` WHERE id = ?",
      [data.user_id]
    );
    if (confirmuser.length === 0) {
      throw new Error("존재하지 않는 사용자입니다.");
    }

    const [confirminprogress] = await pool.query(
      //이미 진행중인 미션인지 확인
      `SELECT EXISTS(SELECT * FROM user_mission WHERE user_id=? AND mission_id=? AND status='IN_PROGRESS') as isInProgress;`,
      [data.user_id, data.mission_id]
    );

    if (confirminprogress[0].isInProgress) {
      throw new Error("이미 진행중인 미션입니다.");
    }

    const [result] = await pool.query(
      `INSERT INTO user_mission(user_id, mission_id, status) VALUES (?, ?, 'IN_PROGRESS')`,
      [data.user_id, data.mission_id]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

export const getUserMission = async (userMissionId) => {
  const conn = await pool.getConnection();

  try {
    const [userMission] = await pool.query(
      `SELECT * FROM user_mission WHERE id = ?;`,
      userMissionId
    );

    console.log(userMission);

    if (userMission.length == 0) {
      return null;
    }

    return userMission[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
