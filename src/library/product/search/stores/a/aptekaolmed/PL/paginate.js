
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'aptekaolmed',
    nextLinkSelector: '#paging_setting_top > div > div > a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'aptekaolmed.pl',
    zipcode: '',
  },
};
