
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    domain: 'currys.co.uk',
    loadedSelector: 'h1.page-title',
    noResultsXPath: "//p[@class='e404-headline']",
    zipcode: '',
  },
};
