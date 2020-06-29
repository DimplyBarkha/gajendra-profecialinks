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
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  await context.waitForXPath('//button[@data-test="storeId-utilityNavBtn"]');
  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    document.getElementById('storeId-utilityNavBtn').click();
    await stall(1000);
  });
  await context.setInputValue('#zipOrCityState', inputs.zipcode);
  await context.evaluate(async function () {
    document.querySelector('button[data-test="storeLocationSearch-button"]').click();
  });
  await context.waitForXPath("//button[@data-test='storeId-listItem-setStore']");
  await context.evaluate(function () {
    document.querySelectorAll('button[data-test="storeId-listItem-setStore"]')[0].click();
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
    store: 'target',
    domain: 'target.com',
    url: 'https://www.target.com/s?searchTerm={searchTerms}',
    loadedSelector: 'ul li',
    noResultsXPath: '//h1[contains(.,"no results found")]',
  },
  implementation,
};
