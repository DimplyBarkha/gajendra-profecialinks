
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'petsathome',
    domain: 'petsathome.com',
    loadedSelector: 'div.container_full_width',
    noResultsXPath: '//h2[contains(@class,"results-no-results__title")] | //h1[contains(text(),"Generic Error")]',
  },
};
