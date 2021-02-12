async function implementation (inputs, parameters, context, dependencies) {
  const { id } = inputs;
  const { goto } = dependencies;
  /* API to get storeID from zipcode */
  async function getStoreId (zipcode) {
    await goto({ url: `https://www.walmart.com/grocery/v4/api/serviceAvailability?postalCode=${zipcode}` });
    const json = await context.evaluate(() => JSON.parse(document.body.innerText));
    return json.accessPointList[0].assortmentStoreId || json.accessPointList[0].dispenseStoreId;
  }

  // Add zipCode-StoreId map. use it if want to avoid API
  const storeIdObj = {
    20166: '2038',
  };
  if (!(inputs.storeId || inputs.StoreID) && inputs.zipcode) {
    inputs.storeId = await getStoreId(inputs.zipcode); /* || storeIdObj[inputs.zipcode] && storeIdObj[inputs.zipcode.toString()]; */
  }
  if (parameters.url) {
    const storeId = inputs.storeId || inputs.StoreID || 5334;
    const zipcode = inputs.zipcode || inputs.Postcode || '';
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    return url + `&storeId=${storeId}#zipcode=${zipcode}`;
  }
}
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'walmarttogo.api',
    prefix: null,
    url: 'https://www.walmart.com/grocery/v3/api/products/{id}?itemFields=all&nutritionPrescriptive=true',
    country: 'US',
    store: 'walmarttogo',
  },
  dependencies: {
    goto: 'action:navigation/goto',
  },
  implementation,
};
