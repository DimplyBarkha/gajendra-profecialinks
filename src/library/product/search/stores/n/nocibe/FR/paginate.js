
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'nocibe',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="products-list"]',
    noResultsXPath: '//div[@class="srchrslt noresult"] | //div[@class="cntnt__content"] | //section[@id="brandLanding"]',
    openSearchDefinition: null,
    domain: 'nocibe.fr',
    zipcode: '',
  },
};
