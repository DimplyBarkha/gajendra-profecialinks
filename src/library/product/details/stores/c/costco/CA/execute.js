
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    domain: 'costco.ca',
    loadedSelector: 'h1[itemprop*="name"]',
    noResultsXPath: '//div[contains(@id,"not_found_body")]//h1 | //div[contains(@id,"not_found_body")]//div[contains(text(),"Sorry")]',
    zipcode: '',
  },
};
