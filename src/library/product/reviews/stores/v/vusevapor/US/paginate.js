
module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'US',
    store: 'vusevapor',
    nextLinkSelector: 'li.item.pages-item-next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'vusevapor.com',
    zipcode: '',
  },
};
