import { prisma } from "../db.config.js";
import { StoreData } from "../types/types.js";

export const addStore = async (data: any): Promise<number | null> => {
  // 동일한 지역에 같은 이름의 가게가 있는지 확인
  const existingStore = await prisma.store.findFirst({
    where: {
      region_id: data.region_id,
      name: data.name,
    },
  });

  if (existingStore) {
    return null; //DuplicateStoreError 로 잡음
  }

  const newStore = await prisma.store.create({
    data: {
      name: data.name,
      region_id: data.region_id,
    },
  });

  return newStore.id;
};

export const getStore = async (storeId: number): Promise<StoreData | null> => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      region: {
        select: {
          name: true,
        },
      },
    },
  });

  console.log(store);

  if (!store) {
    return null;
  }

  return {
    ...store,
    region_name: store.region.name,
  };
};
