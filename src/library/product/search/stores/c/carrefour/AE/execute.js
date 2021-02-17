// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   console.log('params', parameters);
//   const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
//   await dependencies.goto({ url, zipcode: inputs.zipcode });

//   if (parameters.loadedSelector) {
//     await context.waitForFunction(function (sel, xp) {
//       return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
//     }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
//   }
//   console.log('Checking no results', parameters.noResultsXPath);
//   let page = 1;
//   while (1) {
//     try {
//       await context.waitForSelector('button.ltr-1upsixo');
//       await context.click('button.ltr-1upsixo');
//     } catch (e) {
//       console.log(e);
//       break;
//     }
//     page++;
//     if (page > 20) {
//       break;
//     }
//   }
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
    country: 'AE',
    store: 'carrefour',
    domain: 'carrefouruae.com',
    url: 'https://www.carrefouruae.com/v4/search?keyword={searchTerms}',
    // url: 'https://www.carrefouruae.com/v4/search?currentPage=0&filter=&keyword={searchTerms}&nextPageOffset=0&pageSize=60&sortBy=relevance',
    loadedSelector: 'div.ltr-14tfefh div[offset="5"]', //'ul[data-testid="scrollable-list-view"] div.ltr-jyyiad',
    noResultsXPath: '//h2[@data-testid="no-result-text"]',
    zipcode: "''",
  },
  //implementation,
};
