async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));

  await dependencies.goto({ url });

  await context.evaluate(() => {
    const overlay = document.getElementsByClassName('ReactModal__Overlay ReactModal__Overlay--after-open ModalitySelectorDynamicTooltip--Overlay page-popovers')[0];

    // change overlay to nodelist and double check before click
    if (overlay !== undefined) {
      overlay.click();
    }
  });

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
    country: 'US',
    store: 'kroger',
    domain: 'kroger.com',
    url: 'https://www.kroger.com/search?query={searchTerms}&searchType=natural&fulfillment=all',
    loadedSelector: '.PaginateItems',
    // noResultsXPath: 'count(//div[contains(@class,"AutoGrid-cell")])=0',
    noResultsXPath: "//p[@class='no-query-results heading-l font-medium mt-0']",
  },
  implementation,
};
