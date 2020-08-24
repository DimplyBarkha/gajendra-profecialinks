
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    domain: 'boulanger.com',
    loadedSelector: 'div[id="pp"]',
    noResultsXPath: '//div[@class="blocListe"]',
    zipcode: '',
  },
};
