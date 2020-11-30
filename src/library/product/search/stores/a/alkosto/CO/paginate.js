
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'alkosto',
    nextLinkSelector: 'a[class*=next]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.toolbar',
    noResultsXPath: '//div[@class="contenedor elementos"]',
    openSearchDefinition: null,
    domain: 'alkosto.com',
    zipcode: '',
  },
};
