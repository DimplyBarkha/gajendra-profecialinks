
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    domain: 'selfridges.com',
    loadedSelector: 'section.o-layout__container',
    noResultsXPath: "//h2[contains(text(),'Oops, sorry we can't find that page')]",
    zipcode: '',
  },
};
