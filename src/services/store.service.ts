import { responseFromStore } from "../dtos/store.dto.js";
import { addStore, getStore } from "../repositories/store.repository.js";
import { DuplicateStoreError } from "../errors.js";

export const storeSignUp = async (data) => {
  const joinStoreId = await addStore({
    name: data.name,
    region_id: data.region_id,
  });
  if (joinStoreId === null) {
    throw new DuplicateStoreError("이미 존재하는 가게입니다.", data);
  }

  const store = await getStore(joinStoreId);
  // Store가 방금 생성되었으므로, 여기서 null이 나올 가능성은 매우 희박하다.
  // 따라서 이 경우에 대한 StoreNotFoundError처리는 필요하지 않다.
  return responseFromStore(store);
};
