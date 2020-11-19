
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    domain: 'marionnaud.fr',
    url: 'https://www.marionnaud.fr/search?q=soin%20anti%20age',
    loadedSelector: 'ul[class="product-listing product-grid"] li',
    noResultsXPath: 'div[@class="title_holder"]//p[@id="noSearchHeading"]',
    zipcode: '',
  },
};
