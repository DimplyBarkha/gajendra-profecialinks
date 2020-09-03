
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'milar',
    domain: 'milar.es',
    url: 'https://www.milar.es/tablet-samsung-galaxy-tab-a19-32gb-silve.html',
    loadedSelector: 'div#df-results__dfclassic',
    noResultsXPath: '//p[contains(text(),"No Records")]',
    zipcode: '',
  },
};
