
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'harveynorman',
    nextLinkSelector: 'div:not(.hidden-xs) > div>ol>li:not(.inactive)> a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.hproduct-col.product-col',
    noResultsXPath: 'null',
    openSearchDefinition: null,
    domain: 'harveynorman.co.nz',
    zipcode: '',
  },
};
