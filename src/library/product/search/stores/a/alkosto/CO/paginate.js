
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'alkosto',
    nextLinkSelector: 'a.next.salesperson-text-decoration-none',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.toolbar',
    noResultsXPath: '//div[@class="bannerpro-pager"]',
    openSearchDefinition: null,
    domain: 'alkosto.com',
    zipcode: '',
  },
};
