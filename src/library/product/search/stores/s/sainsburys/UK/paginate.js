module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'sainsburys',
    nextLinkSelector: 'div.pagination ul.pages li.next>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#productsContainer ul.productLister li',
    openSearchDefinition: null,
    domain: 'sainsburys.co.uk',
  },
};
