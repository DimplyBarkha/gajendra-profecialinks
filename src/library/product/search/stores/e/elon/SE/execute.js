
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'elon',
    domain: 'elon.se',
    url: 'https://www.elon.se/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.product-list > div > ol',
    noResultsXPath: '//div[contains(@class,"message notice")]',
  },
};
