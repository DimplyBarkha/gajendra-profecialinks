
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'tesco',
    nextLinkSelector: 'p.next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.products li',
    noResultsXPath: '//p[contains(.,"No products are available")]',
    openSearchDefinition: null,
    domain: 'tesco.ie',
    zipcode: '',
  },
};
