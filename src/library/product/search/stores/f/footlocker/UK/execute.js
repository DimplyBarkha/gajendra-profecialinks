module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'footlocker',
    domain: 'footlocker.co.uk',
    url: 'https://www.footlocker.co.uk/en/search?q={searchTerms}',
    loadedSelector: 'img[alt*="Logo"]',
    noResultsXPath: '//h2[contains(text(),"no results")]',
    zipcode: '',
  },
};
