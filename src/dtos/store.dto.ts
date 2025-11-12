export const bodyToStore = (body) => {
  return {
    name: body.name,
    region_id: body.region_id,
  };
};

export const responseFromStore = (store) => {
  return {
    store_name: store.name,
    region_name: store.region_name,
  };
};
