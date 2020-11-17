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
    await context.click('div.coi-button-group button.coi-banner__accept');
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
    country: 'DK',
    store: 'nemlig',
    domain: 'nemlig.com',
    url: 'https://www.nemlig.com/?search={searchTerms}',
    loadedSelector: 'div#searchscrollable div.searchresult__item-container productlist-item',
    noResultsXPath: '//div[@id="searchscrollable"]//h3[@class="contact__subhead" and contains(text(),"Kundeservice sidder klar til at hjælpe dig alle ugens dage")]',
    zipcode: "''",
  },
  implementation,
};
