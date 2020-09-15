
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'traklin',
    domain: 'traklin.co.il',
    url: 'https://www.traklin.co.il/search_results.aspx?val={searchTerms}',
    loadedSelector: 'div[class*="contents_wrap_all"] div[class*="matrix"]',
    noResultsXPath: '//h1[contains(text(), "לא נמצאו תוצאות חיפוש")]',
    zipcode: '',
  },
};
