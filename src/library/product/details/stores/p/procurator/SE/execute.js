
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'procurator',
    domain: 'procurator.net',
    loadedSelector: 'div.active img',
    noResultsXPath: '//h1[text()="Hoppsan, något blev fel!"]',
    zipcode: '',
  },
};
