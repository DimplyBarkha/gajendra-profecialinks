
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'HU',
    store: 'tesco',
    domain: 'tesco.hu',
    url: 'https://tesco.hu/kereses/?q={searchTerms}',
    loadedSelector: 'div.product-container .element-wrapper',
    noResultsXPath: '//p/b[@data-ol-has-click-handler and contains(text(),"0")]',
    zipcode: '',
  },
};
