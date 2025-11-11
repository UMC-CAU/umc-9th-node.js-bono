import { prisma } from "../db.config.js";

export const addStore = async (data) => {
  try {
    // 동일한 지역에 같은 이름의 가게가 있는지 확인
    const existingStore = await prisma.store.findFirst({
      where: {
        region_id: data.region_id,
        name: data.name,
      },
    });

    if (existingStore) {
      throw new Error("동일한 지역에 같은 이름의 가게가 이미 존재합니다.");
    }

    const newStore = await prisma.store.create({
      data: {
        name: data.name,
        region_id: data.region_id,
      },
    });

    return newStore.id;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const getStore = async (storeId) => {
  try {
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
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};
