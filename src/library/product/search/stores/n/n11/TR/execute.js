
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    domain: 'n11.com',
    url: 'https://www.n11.com/arama?q={searchTerms}',
    loadedSelector: '#view>ul>li:nth-last-child(2)',
    noResultsXPath: '//p[@class="result-mean-text-mm"] | //div[@class="notFoundContainer"]',
    zipcode: '',
  },
};
