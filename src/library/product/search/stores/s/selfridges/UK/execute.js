
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    domain: 'selfridges.com',
    url: 'https://www.selfridges.com/GB/en/cat/?freeText={searchTerms}&srch=Y',
    loadedSelector: null,
    noResultsXPath: '//p[contains(text(), "We can\'t seem to find any results")]',
    zipcode: '',
  },
};
