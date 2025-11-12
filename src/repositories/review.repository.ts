import { prisma } from "../db.config.js";

export const addReview = async (data) => {
  const isExistStore = await prisma.store.findFirst({
    where: { id: data.store_id },
  });

  if (!isExistStore) {
    return null; //->StoreNotFoundError
  }

  const created = await prisma.review.create({
    data: {
      user_id: data.user_id,
      store_id: data.store_id,
      content: data.content,
      rate: data.rate,
    },
  });

  return created.id;
};

export const getReview = async (reviewId) => {
  //이건 리뷰 하나만 가져오는거
  const review = await prisma.review.findFirst({
    where: { id: reviewId },
  });

  return review;
};

export const getStoreReviews = async (storeId, cursor = 0) => {
  const isExistStore = await prisma.store.findFirst({
    where: { id: storeId },
  });

  if (!isExistStore) {
    return null; //->StoreNotFoundError
  }
  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      store_id: true,
      user_id: true,
      created_at: true,
      rate: true,
      store: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
    where: {
      store_id: storeId,
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews; //return []인건 null이 아니다!
};

export const getUserReviews = async (userId, cursor = 0) => {
  const isExistUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isExistUser) {
    return null; //->UserNotFoundError
  }

  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      store_id: true,
      user_id: true,
      created_at: true,
      rate: true,
      store: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
    where: {
      user_id: userId,
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};
