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
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};
