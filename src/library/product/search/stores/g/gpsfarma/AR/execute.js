/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
/*async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  console.log("ganesh.....1");
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  console.log("ganesh.....1 click");
  try {
    await context.click('#WpnPushdialogid #btnNoIdWpnPush');
    //await context.click('#gps-location-form #location-region-selector option[value="509"]');
    //await context.click('#gps-location-form #location-city-selector option[value="1"]');
    //await context.click('#gps-location-form #location-submit-button');
  }catch (e) {
    console.log(e);
  }
  console.log("ganesh.....2");
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  try {
    await context.click('#gps-location-form #location-region-selector');    
  }catch (e) {
    console.log(e);
  }
  try {
    await context.select('#location-region-selector option + option + option');
  }catch (e) {
    console.log(e);
  }
  console.log("ganesh.....2 click");
  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}
*/
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AR',
    store: 'gpsfarma',
    domain: 'gpsfarma.com',
    url: 'https://www.gpsfarma.com/catalogsearch/result/index/?limit=56&q={searchTerms}',
    loadedSelector: "ul[id='list_default'] li div[class='image-wrapper'] a img",
    noResultsXPath: "//div[@class='texts-cont']//h2[text()='¡Lo sentimos!']",
    zipcode: '',
  },
  //implementation,
};
