module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'salonsupplies',
    domain: 'salonsupplies.co.uk',
    url: 'https://salonsupplies.co.uk/search?q={searchTerms}',
    loadedSelector: 'div.contentGrid ul li a.productimage img',
    noResultsXPath: '//p[contains(text(),"we found 0 related products")]',
  },
};
