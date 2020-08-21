
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'harveynorman',
    nextLinkSelector: 'li:not(.inactive) > a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.hproduct-col.product-col',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'harveynorman.ie',
    zipcode: '',
  },
};
