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
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  try {
    await context.click('button.accept-button');
  }catch (e) {
    console.log(e);
  }
  let scrollTop = 0;
  while (scrollTop !== 200000) {
    await stall(500);
    scrollTop += 1000;
    let oldScroll = await context.evaluate(() => {return document.querySelector('.product-search-result-list').scrollHeight;});
    await context.evaluate(() => {document.querySelector('.product-search-result-list').scrollBy(0, document.querySelector('.product-search-result-list').scrollHeight + 1000);});
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    let newScroll = await context.evaluate(() => {return document.querySelector('.product-search-result-list').scrollHeight;});
    if (newScroll === oldScroll || scrollTop == 200000) {
      await stall(5000);
      break;
    }
  }
  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
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
    country: 'FI',
    store: 'k-ruoka',
    domain: 'k-ruoka.fi',
    url: 'https://www.k-ruoka.fi/kauppa/tuotehaku?haku={searchTerms}',
    loadedSelector: 'ul#product-search-results',
    noResultsXPath: "//div[@class='product-search-query']//span[contains(text(),'vastaavia tuotteita ei löytynyt')]",
    zipcode: '',
  },
  implementation,
};
