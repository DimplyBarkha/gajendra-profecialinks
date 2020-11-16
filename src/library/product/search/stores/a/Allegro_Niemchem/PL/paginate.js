
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'Allegro_Niemchem',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'article > div > div > div > a > img',
    noResultsXPath: '//div[@class="opbox-listing"]//p[contains(@class,"mp0t_ji")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'allegro.pl',
    zipcode: '',
  },
};
