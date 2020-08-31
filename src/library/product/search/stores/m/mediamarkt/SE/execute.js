
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'mediamarkt',
    domain: 'mediamarkt.se',
    url: 'https://www.mediamarkt.se/sv/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmsesv',
    loadedSelector: 'div.product-wrapper',
    noResultsXPath: '//div[contains(@id, "search_no_result")]',
    zipcode: '',
  },
};
