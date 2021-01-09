
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.span-20.last.slideGridDiv3',
    noResultsXPath: '//div[@class="span-24"] | //div[@class="page-not-found-content"] | //div[@class="title_holder titleNoResult"]',
    openSearchDefinition: null,
    domain: 'alcampo.es',
    zipcode: '',
  },
};
