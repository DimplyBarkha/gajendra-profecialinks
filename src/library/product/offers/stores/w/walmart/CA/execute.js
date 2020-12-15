
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    domain: 'walmart.ca',
    loadedSelector: '[data-automation="product-title"]',
    // noResultsXPath: '/html/body[not(//h1[@data-automation="product-title"])]',
    offerUrl: 'https://www.walmart.ca/en/ip/{id}#[!opt!]{"type":"json"}[/!opt!]',
    zipcode: '',
  },
};
