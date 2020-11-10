
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'salonsupplies',
    domain: 'salonsupplies.co.uk',
    loadedSelector: null,
    noResultsXPath: '//h1[contains(text(),"404")]',
    zipcode: "''",
  },
};
