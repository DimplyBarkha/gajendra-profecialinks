
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'costco',
    domain: 'costco.com',
    loadedSelector: 'h1[itemprop*="name"]',
    noResultsXPath: '//div[contains(@id,"not_found_body")]//h1 | //div[contains(@id,"not_found_body")]//div[contains(text(),"Sorry")]',
    zipcode: '',
  },
};
