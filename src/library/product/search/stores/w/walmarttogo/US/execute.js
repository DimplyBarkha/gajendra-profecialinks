async function implementation (inputs, parameters, context, dependencies) {
  const { id } = inputs;
  const { goto } = dependencies;
  /* API to get storeID from zipcode, currently hardcoding using storeIdObj as API might get blocked. */
  async function getStoreId (zipcode) {
    await goto({ url: `http://grocery.walmart.com/v4/api/products/search?count=60&offset=0&page={page}&storeId={storeId}&query={searchTerms}`});
    const json = await context.evaluate(() => JSON.parse(document.body.innerText));
    return json.accessPointList[0].assortmentStoreId || json.accessPointList[0].dispenseStoreId;
  }

  // Add zipCode-StoreId map.
  const storeIdObj = {
    20166: '2038',
  };
  if (!inputs.storeId && inputs.zipcode) {
    inputs.storeId = await getStoreId(inputs.zipcode); /* || storeIdObj[inputs.zipcode] && storeIdObj[inputs.zipcode.toString()]; */
  }
  if (parameters.url) {
    const storeId = inputs.storeId || 5334;
    const zipcode = inputs.zipcode || '';
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    return url + `&storeId=${storeId}#zipcode=${zipcode}`;
  }
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'walmarttogo',
    domain: 'walmarttogo.api',
    url: 'http://grocery.walmart.com/v4/api/products/search?count=60&offset=0&page={page}&storeId={storeId}&query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
  },
  implementation,
};
