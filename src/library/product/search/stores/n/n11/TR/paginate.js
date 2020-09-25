
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    nextLinkSelector: 'a.next.navigation',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#view>ul>li:nth-last-child(2)',
    noResultsXPath: '//p[@class="result-mean-text-mm"] | //div[@class="notFoundContainer"]',
    openSearchDefinition: null,
    domain: 'n11.com',
    zipcode: '',
  },
};
