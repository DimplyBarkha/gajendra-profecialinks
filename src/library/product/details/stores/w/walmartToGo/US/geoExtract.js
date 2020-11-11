const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const storeId = inputs.storeId;
  const zipcode = inputs.zipcode;
  async function getAccessPointID ({ zipcode, storeId }) {
    const api = `https://www.walmart.com/grocery/v4/api/serviceAvailability?postalCode=${zipcode}`;
    const response = await fetch(api);
    const data = await response.json();
    const accessPointId = data.accessPointList.find(elm => elm.assortmentStoreId.includes(storeId));
    if (accessPointId) {
      return accessPointId.assortmentStoreId;
    }
    return false;
  }
  async function setStore (accessID) {
    const api = `https://www.walmart.com/grocery/v3/api/cart/${document.cookie.match(/GCRT=([^;]+)/)[1]}`;
    const body = { accessPointId: accessID, currencyCode: 'USD' };
    await fetch(api, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'wg-correlation-id': 'c4aaacd0-2452-11eb-8711-738f756eaabc',
        'x-csrf-jwt': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiaGVhZGVyIiwidXVpZCI6ImM0Y2JhMjUwLTI0NTItMTFlYi05YjRlLTU5NDkzMGI0YjMwZSIsImlhdCI6MTYwNTEyMjM0NywiZXhwIjoxNjA2MjAyMzQ3fQ.CBS2P9g-vks4FE7HolW_72ZTHsppJ9rTBD_1wsHXBmY',
      },
      referrer: 'https://www.walmart.com/grocery/ip/Perrier-Lime-Flavored-Carbonated-Mineral-Water-33-8-fl-oz-Plastic-Bottle/152265602',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: JSON.stringify(body),
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
    });
  }
  const noAddress = await context.evaluate(() => !!document.querySelector('[data-automation-id="fulfillmentBannerAddress"]'));
  if (!noAddress) {
    const accessID = await context.evaluate(getAccessPointID, { zipcode, storeId });
    await context.evaluate(setStore, accessID);
    await context.reload();
  }

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/geo/geoExtract',
  parameterValues: {
    country: 'US',
    store: 'walmartToGo',
    transform,
    domain: 'walmart.com',
  },
  implementation,
};
