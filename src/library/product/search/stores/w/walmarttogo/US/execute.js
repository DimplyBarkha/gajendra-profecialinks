
async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { searchURL, keywords, query } = inputs;

  console.log(`searchURL: ${searchURL}`);
  url = searchURL || url;
  console.log(url);

  if (url.includes('{searchTerms}') && !keywords) throw new Error('No keywords provided');
  if (url.includes('{queryParams}') && !query) throw new Error('No query provided');

  /* API to get storeID from zipcode */
  async function getStoreId (zipcode) {
    await dependencies.goto({ url: `https://www.walmart.com/grocery/v4/api/serviceAvailability?postalCode=${zipcode}` });
    const json = await context.evaluate(() => JSON.parse(document.body.innerText));
    return json.accessPointList[0].assortmentStoreId || json.accessPointList[0].dispenseStoreId;
  }
  if (!inputs.storeId && inputs.zipcode) {
    inputs.storeId = await getStoreId(inputs.zipcode); /* || storeIdObj[inputs.zipcode] && storeIdObj[inputs.zipcode.toString()]; */
  }

  // to match OV storeID which is 5884 
  const storeId = inputs.storeId || 5884;
  
  // const storeId = inputs.storeId || 5334;
  // Add zipCode-StoreId map. use it if want to avoid API
  const storeIdObj = {
    20166: '2038',
  };
  const destinationUrl = url
    .replace('{searchTerms}', encodeURIComponent(keywords))
    .replace('{queryParams}', query)
    .replace('{storeId}', storeId);
  await dependencies.goto({ ...inputs, url: destinationUrl });

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log(`noResultsXPath: ${noResultsXPath}`);
  return await context.evaluate((xp) => !document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), noResultsXPath);
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'walmarttogo',
    domain: 'walmarttogo.api',
    url: 'http://grocery.walmart.com/v4/api/products/search?count=60&offset=0&page=1&storeId={storeId}&query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: "//body[contains(.,'totalCount\":0,')]",
  },
  implementation,
};
