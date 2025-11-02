import { pool } from "../db.config.js";

export const addReview = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [confirm] = await pool.query(
      //store_id 존재하는지 확인
      `SELECT EXISTS(SELECT 1 FROM store WHERE id=?) as isExistStore;`,
      [data.store_id]
    );

    const [result] = await pool.query(
      `INSERT INTO review(user_id, store_id, content, rate) VALUES (?, ?, ?, ?)`,
      [data.user_id, data.store_id, data.content, data.rate]
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

export const getReview = async (reviewId) => {
  const conn = await pool.getConnection();

  try {
    const [review] = await pool.query(
      `SELECT * FROM review JOIN store ON review.store_id = store.id WHERE review.id = ?;`,
      reviewId
    );

    console.log(review);

    if (review.length == 0) {
      return null;
    }

    return review[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
