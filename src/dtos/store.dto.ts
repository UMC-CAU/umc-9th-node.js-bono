interface StoreSignUpRequest {
  name: string;
  region_id: number;
}

interface StoreSignUpResponse {
  store_name: string;
  region_name: string;
}

export const bodyToStore = (body: any): StoreSignUpRequest => {
  return {
    name: body.name,
    region_id: body.region_id,
  };
};

export const responseFromStore = (store: any): StoreSignUpResponse => {
  return {
    store_name: store.name,
    region_name: store.region_name,
  };
};
