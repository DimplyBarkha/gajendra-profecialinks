
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'harveynorman',
    nextLinkSelector: 'div.push-out ol.pager a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.hproduct-col.product-col',
    noResultsXPath: '//p[contains(text(),"Search was unable to find any results for")]',
    openSearchDefinition: null,
    domain: 'harveynorman.co.nz',
    zipcode: '',
  },
};
