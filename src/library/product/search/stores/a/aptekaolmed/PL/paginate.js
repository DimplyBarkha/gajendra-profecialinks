
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'aptekaolmed',
    mutationSelector: null,
    // nextLinkSelector: '#paging_setting_top > div > div > a.next',
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'aptekaolmed.pl',
    zipcode: '',
  },
};
