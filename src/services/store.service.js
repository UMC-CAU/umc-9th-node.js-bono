import { responseFromStore } from "../dtos/store.dto.js";
import { addStore, getStore } from "../repositories/store.repository.js";

export const storeSignUp = async (data) => {
  const joinStoreId = await addStore({
    name: data.name,
    region_id: data.region_id,
  });
  if (joinStoreId === null) {
    throw new Error("이미 존재하는 가게입니다.");
  }

  const store = await getStore(joinStoreId);
  return responseFromStore(store);
};
