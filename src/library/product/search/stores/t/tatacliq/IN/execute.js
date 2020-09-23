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

  try {
    await context.waitForFunction(function (xp) {
      return Boolean(document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, '//div[contains(.,\'Exclude out of stock\')]//div[contains(@style,\'cancelGrey\')]');

    // Check if out of stock items are excluded & click it if loaded
    await context.evaluate(function () {
      const outOfStockCancelBtn = document.evaluate('//div[contains(.,\'Exclude out of stock\')]//div[contains(@style,\'cancelGrey\')]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (outOfStockCancelBtn) {
        console.log('Clicking to remove the filter for including out of stock items also');
        // @ts-ignore
        outOfStockCancelBtn.click();
      }
    });
  } catch (err) {
    console.log('Error while  removing the exclude items filter' + JSON.stringify(err));
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
    country: 'IN',
    store: 'tatacliq',
    domain: 'tatacliq.com',
    url: 'https://www.tatacliq.com/search/?searchCategory=all&text={searchTerms}',
    loadedSelector: 'div#grid-wrapper_desktop>div>div>div>div>div:last-child',
    noResultsXPath: '/html[not(//div[contains(@id,"ProductModule")])]',
    zipcode: '',
  },
  implementation,
};
