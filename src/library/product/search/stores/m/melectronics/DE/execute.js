/**
 *
 * @param { { keywords: string, zipcode: string, storeID: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { keywords } = inputs;
  const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords));
  await dependencies.goto({ ...inputs, url: destinationUrl });

  try {
    await context.clickAndWaitForNavigation('.btn__md.btn__secondary');
  } catch (e) {
    console.log(e);
  }

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'melectronics',
    domain: 'melectronics.ch',
    url: 'https://www.melectronics.ch/de/s?q={searchTerms}',
    loadedSelector: 'div.p-product-listing--item.p-product-listing--item__content.col-md-9.col-sm-12',
    noResultsXPath: '//h2[contains(text(),"Leider konnten wir für Ihre Suche keine Ergebnisse finden. Vielleicht hilft dies:")]',
    zipcode: "''",
  },
  implementation,
};
