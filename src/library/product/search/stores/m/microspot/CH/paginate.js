
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    nextLinkSelector: 'li[class="K2DOit"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#container-productlist',
    noResultsXPath: '//h1[@class="_3L3q2V Qmn5eI"]',
    openSearchDefinition: null,
    domain: 'microspot.ch',
    zipcode: '',
  },
};
