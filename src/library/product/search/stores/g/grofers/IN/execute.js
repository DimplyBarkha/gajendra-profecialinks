// /**
//  *
//  * @param { { keywords: string, zipcode: string } } inputs
//  * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
//  * @param { ImportIO.IContext } context
//  * @param { { goto: ImportIO.Action} } dependencies
//  */
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   console.log('params', parameters);
//   const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
//   await dependencies.goto({ url, zipcode: inputs.zipcode });

//   try {
//     await context.click('div.user-address');
//     await context.waitForSelector('div.img-loader__wrapper img[alt="Mumbai"]');
//     await context.click('div.img-loader__wrapper img[alt="Mumbai"]');
//   } catch (exception) {
//     console.log(exception);
//   }

//   if (parameters.loadedSelector) {
//     await context.waitForFunction(function (sel, xp) {
//       return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
//     }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
//   }
//   console.log('Checking no results', parameters.noResultsXPath);
//   return await context.evaluate(function (xp) {
//     const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
//     console.log(xp, r);
//     const e = r.iterateNext();
//     console.log(e);
//     return !e;
//   }, parameters.noResultsXPath);
// }

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'grofers',
    domain: 'grofers.com',
    url: 'https://grofers.com/s/?q={searchTerms}',
    loadedSelector: 'div.products a.product__wrapper',
    noResultsXPath: '//h1[@class="no-result__msg-main"]',
    zipcode: "''",
  },
 // implementation,
};
