
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'madcoop',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'td.products',
    noResultsXPath: '//td[contains(@class,"products depth_1")]/table/tbody[count(*)=0]',
    openSearchDefinition: null,
    domain: 'butik.mad.coop.dk',
    zipcode: '',
  },
};