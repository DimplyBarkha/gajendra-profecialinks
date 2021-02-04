
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'UA',
    store: 'comfy',
    nextLinkSelector: null, // 'head link[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.js-products-list-wrap',
    noResultsXPath: '//div[@class="search-top"]/h3',
    openSearchDefinition: null,
    domain: 'comfy.ua',
    zipcode: '',
  },
};
