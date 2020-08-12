module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    domain: 'amazon.com',
    url: 'https://www.amazon.fr/s?k={searchTerms}',
  }, 
};