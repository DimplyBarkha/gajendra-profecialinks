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
//     // await context.waitForSelector('div.mfcss_full-notification-button button');
//     // await context.click('div.mfcss_full-notification-button button');
//     // await new Promise((resolve, reject) => setTimeout(resolve, 1000));
//   } catch (e) {
//     //
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
    country: 'ZA',
    store: 'makro',
    domain: 'makro.co.za',
    url: 'https://www.makro.co.za/search/?pageSize=80&text={searchTerms}',
    loadedSelector: 'div#mak-body-content',
    noResultsXPath: `//div[@class="searchEmpty-title"]/*[contains(text(),"We couldn't find any results for")]`,
    zipcode: '',
  },
};
