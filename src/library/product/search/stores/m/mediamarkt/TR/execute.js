
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'mediamarkt',
    domain: 'mediamarkt.tr',
    url: 'https://www.mediamarkt.com.tr/tr/search.html?query="{searchTerms}"&searchProfile=onlineshop&channel=mmtrtr',
    loadedSelector: 'div.product-wrapper',
    noResultsXPath: '//div[@id="search_no_result-top"]',
    zipcode: '',
  },
};
