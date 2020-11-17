
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    domain: 'merqueo.com',
    url: 'https://merqueo.com/bogota/buscar/{searchTerms}',
    loadedSelector: '.main-layout',
    noResultsXPath: null, // '//figure[@class="mq-grid-notfound mq-finder-not-found big"]',
    zipcode: '',
  },
};
