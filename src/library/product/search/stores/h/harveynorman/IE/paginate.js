
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'harveynorman',
    nextLinkSelector: 'li:not(.inactive) > a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.hproduct-col.product-col',
    noResultsXPath: '//p[starts-with(text(),"Search was unable to find any results for")]',
    openSearchDefinition: null,
    domain: 'harveynorman.ie',
    zipcode: '',
  },
};
