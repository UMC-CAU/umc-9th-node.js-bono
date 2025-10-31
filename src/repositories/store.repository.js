import { pool } from "../db.config.js";

export const addStore = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM store WHERE region_id=? AND name=?) as isExistStoreinRegion;`,
      [data.region_id, data.name]
    );

    const [result] = await pool.query(
      `INSERT INTO store(name,region_id) VALUES (?,?);`,
      [data.name, data.region_id]
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

export const getStore = async (storeId) => {
  const conn = await pool.getConnection();

  try {
    const [store] = await pool.query(
      `SELECT store.*, region.name as region_name 
            FROM store, region 
            WHERE store.region_id = region.id AND store.id = ?;`,
      storeId
    );

    console.log(store);

    if (store.length == 0) {
      return null;
    }

    return store;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
