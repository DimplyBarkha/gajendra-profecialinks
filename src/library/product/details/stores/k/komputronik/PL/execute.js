
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'komputronik',
    domain: 'komputronik.pl',
    loadedSelector: null,
    noResultsXPath: '//h2[contains(text(),"404")]',
    zipcode: "''",
  },
};
