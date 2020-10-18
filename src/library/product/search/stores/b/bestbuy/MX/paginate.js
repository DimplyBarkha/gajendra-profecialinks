
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'bestbuy',
    nextLinkSelector: "ul[class='pagination-controls'] li[class='pager'] a[aria-label='Página Siguiente']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'bestbuy.com.mx',
    zipcode: '',
  },
};
