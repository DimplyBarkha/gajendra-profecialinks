
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'harveynorman',
    nextLinkSelector: 'div:not(.hidden-xs) > div>ol>li:not(.inactive)> a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.hproduct-col.product-col',
    noResultsXPath: '//p[contains(text(),"Search was unable to find any results for")]',
    openSearchDefinition: null,
    domain: 'harveynorman.co.nz',
    zipcode: '',
  },
};
