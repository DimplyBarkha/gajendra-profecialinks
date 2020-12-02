
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'macys',
    nextLinkSelector: '#filterResultsBottom > ul > li.pagination > ul > li.next-page > div > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'macys.com',
    zipcode: '',
  },
};
