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
    await context.waitForSelector('section#BrandWord div.brandWordStrate button.productStrate__seeMore', { timeout: 1500 });
  } catch (e) {
    console.log(e);
  }
  try {
    await context.evaluate(function () {
      document.querySelector('section#BrandWord div.brandWordStrate button.productStrate__seeMore').click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  } catch (e) {
    console.log(e);
  }
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
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
    country: 'FR',
    store: 'fnac',
    domain: 'fnac.fr',
    url: 'https://www.fnac.com/SearchResult/ResultList.aspx?PageIndex=2&Search={searchTerms}&sft=1&sl',
    loadedSelector: 'article[class*="Article-itemGroup"]',
    noResultsXPath: '//div[contains(@class, "noResults")]',
    zipcode: "''",
  },
};
