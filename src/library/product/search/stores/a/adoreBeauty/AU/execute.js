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
  console.log('Checking no results', parameters.noResultsXPath);

  try {
    await context.click('div#wps_popup div[data-wps-popup-close-intent]');
  } catch (e) {
    console.log(e);
  }

  var buttonNotFoundCount = 0;
  for (let i = 0; i < 20; i++) {
    try {
      await context.click('button.flex.text-white.bg-black');
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    } catch (e) {
      console.log(e);
      buttonNotFoundCount++;
    }
    if (buttonNotFoundCount > 3) {
      break;
    }
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

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
    country: 'AU',
    store: 'adoreBeauty',
    domain: 'adorebeauty.com.au',
    url: 'https://www.adorebeauty.com.au/results?q={searchTerms}',
    loadedSelector: 'li.ais-InfiniteHits-item',
    noResultsXPath: '//p[contains(text(),"Found 0 products")]',
    zipcode: "''",
  },
  implementation,
};
