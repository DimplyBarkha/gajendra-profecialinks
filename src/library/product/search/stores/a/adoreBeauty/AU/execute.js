/*
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

  // Apply scroll
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      while (1) {
        const doesLoadMoreExists = document.querySelector('.ais-InfiniteHits > button:not([disabled])');

        if (doesLoadMoreExists) {
          console.log('Clicking on load more btn');
          // @ts-ignore
          document.querySelector('.ais-InfiniteHits > button:not([disabled])').click();
          await stall(5000);
        } else {
          console.log('load more btn is not present - ' + doesLoadMoreExists);
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
    });
  };

  await applyScroll(context);

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
