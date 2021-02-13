// module.exports = {
//   implements: 'product/search/execute',
//   parameterValues: {
//     country: 'IN',
//     store: 'amazonLg',
//     domain: 'amazon.in',
//     url: 'https://www.amazon.in/s?k={searchTerms}&rh=p_89%3ALG',
//     loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
//     noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "No results")] | //img[contains(@alt,"Dogs of Amazon")] |//*[contains(text(),"Looking for something?")]',
//     zipcode: '',
//   },
// };
async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { searchURL, keywords, query } = inputs;

  console.log(`searchURL: ${searchURL}`);
  url = searchURL || url;
  console.log(url);

  if (url.includes('{searchTerms}') && !keywords) throw new Error('No keywords provided');
  if (url.includes('{queryParams}') && !query) throw new Error('No query provided');

  const destinationUrl = url
    .replace('{searchTerms}', encodeURIComponent(keywords))
    .replace('{queryParams}', query);
  await dependencies.goto({ ...inputs, url: destinationUrl });

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log(`noResultsXPath: ${noResultsXPath}`);
  return await context.evaluate((xp) => !document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(), noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'amazonLg',
    domain: 'amazon.in',
    url: 'https://www.amazon.in/s?k={searchTerms}&ref=nb_sb_noss_2&dc',
    loadedSelector: 'div[data-asin], section.ebx-empathy-x__body',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "No results")] | //img[contains(@alt,"Dogs of Amazon")] |//*[contains(text(),"Looking for something?")]',
    zipcode: '',
    implementation,
  },
};
