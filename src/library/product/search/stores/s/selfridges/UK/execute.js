
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    domain: 'selfridges.uk',
    url: 'https://www.selfridges.com/US/en/cat/?freeText={searchTerms}&pn=1',
    loadedSelector: '.composite-products_list',
    noResultsXPath: '//p[contains(text(), "We can\'t seem to find any results")]',
    zipcode: "''",
  },
};
