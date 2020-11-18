
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'tesco',
    domain: 'tesco.ie',
    url: 'https://www.tesco.ie/groceries/product/search/default.aspx?searchBox={searchTerms}',
    loadedSelector: 'ul.products li',
    noResultsXPath: '//p[contains(.,"No products are available")]',
    zipcode: '',
  },
};
