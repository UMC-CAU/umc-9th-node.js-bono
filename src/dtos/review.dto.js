export const bodyToReview = (body) => {
  return {
    user_id: body.user_id,
    store_id: body.store_id,
    content: body.content,
    rate: body.rate,
  };
};

export const responseFromReview = (review) => {
  console.log("response:", review);
  return {
    user_id: review.user_id,
    store_name: review.name,
    content: review.content,
    created_at: review.created_at,
    rate: review.rate,
  };
};

export const responseFromReviews = (reviews) => {
  //가게의 리뷰 보기, 나의 리뷰 보기 - 두 곳에서 응답 반환 객체로 사용된다.
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};
