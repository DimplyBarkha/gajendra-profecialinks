
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'ao',
    domain: 'ao.com',
    url: "https://ao.com/l/search/101/99/?search='{searchTerms}'",
    loadedSelector: 'a > img[class*="primary-image"]',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: '',
  },
};
