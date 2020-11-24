const req = (method) => {
  const { shop, accessToken } = ctx.session
  return async (payload) => {
    let requestBody = payload.body ? payload.body : undefined;
    if (payload.contentType === "json" && payload.body) {
      requestBody = JSON.stringify(requestBody);
    }
    const result = await fetch(
      `https://${shop}/admin/api/2020-01/shop.json`,
      {
        method,
        headers: {
          'X-Shopify-Access-Token': `${accessToken}`,
          "Content-Type": payload.contentType ? `application/${payload.contentType}` : `application/json`,
          accept: "application/json",
        },
        body: requestBody,
      }
    );
    return result;
  };
};

const postData = req("POST");
const getData = req("GET");
const deleteData = req("DELETE");

export default {
  post: postData,
  get: getData,
  delete: deleteData
}
