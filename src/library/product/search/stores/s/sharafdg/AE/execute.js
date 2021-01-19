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
  // await context.evaluate(async () => {
  //   await new Promise((resolve) => setTimeout(resolve, 6000));
  //   async function infiniteScroll () {
  //     let prevScroll = document.documentElement.scrollTop;
  //     while (true) {
  //       window.scrollBy(0, document.documentElement.clientHeight);
  //       await new Promise(resolve => setTimeout(resolve, 4000));
  //       const currentScroll = document.documentElement.scrollTop;
  //       if (currentScroll === prevScroll) {
  //         break;
  //       }
  //       prevScroll = currentScroll;
  //     }
  //   }
  //   await infiniteScroll();
  // });
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
    country: 'AE',
    store: 'sharafdg',
    domain: 'sharafdg.com',
    url: 'https://uae.sharafdg.com/?q={searchTerms}&post_type=product',
    loadedSelector: 'div.product-items',
    noResultsXPath: "//h2[contains(text(),'No results found')]",
    zipcode: '',
  },
  implementation,
};
