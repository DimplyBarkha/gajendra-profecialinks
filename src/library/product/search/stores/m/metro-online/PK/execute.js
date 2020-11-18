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
  
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));

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
    country: 'PK',
    store: 'metro-online',
    domain: 'metro-online.pk',
    url: "https://metro-online.pk/search/{searchTerms}",
    loadedSelector: null,//"ul[class='productsitems clearfix'] div[class='productdivinner'] div[class='productimg']",
    noResultsXPath: null,//"//a[contains(@class,'blueButton yellowhover') and text()='Search Again']",
    zipcode: '',
  },
  implementation,
};
