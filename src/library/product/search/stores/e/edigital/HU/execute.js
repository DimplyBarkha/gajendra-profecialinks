/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  try {
    await context.click('div[id="wps_popup"] div[data-wps-popup-close]');
  }catch (e) {
    console.log(e);
  }   
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));

  console.log('Checking no results', parameters.noResultsXPath);

  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'HU',
    store: 'edigital',
    domain: 'edigital.hu',
    url: "https://edigital.hu/search3?product[search]={searchTerms}",
    loadedSelector: "div[class='product-list'] ul[id='prefixbox-search-engine'] li[id *='ed-prod-'] div[class='image'] img[class='img-responsive'][src *='product_images']",
    noResultsXPath: "//h1[@class='main-title']//span[@data-vat-value='0']",
    zipcode: '',
  },
  implementation,  
};
