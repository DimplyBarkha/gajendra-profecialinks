
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'HU',
    store: 'tesco',
    nextLinkSelector: 'div.m-productListing__products  a.newddl-button.blue.secondary.no-float[title="Még több"]',
    mutationSelector: null,
    spinnerSelector: 'span.link-label.loading',
    loadedSelector: 'div.product-container .element-wrapper',
    noResultsXPath: '//p/b[@data-ol-has-click-handler and contains(text(),"0")]',
    openSearchDefinition: null,
    domain: 'tesco.hu',
    zipcode: '',
  },
};
