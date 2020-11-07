
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'apotekhjartat',
    nextLinkSelector: 'div[class="row showMore text-center"]>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//p[@class="noSearchResultText"]',
    openSearchDefinition: null,
    domain: 'apotekhjartat.se',
    zipcode: '',
  },
};
