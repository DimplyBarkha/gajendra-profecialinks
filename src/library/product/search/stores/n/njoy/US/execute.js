
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'njoy',
    domain: 'shop.njoy.com',
    url: 'https://njoy.com/us/shop/',
    loadedSelector: 'div.container',
    noResultsXPath: '//h1[contains(text(),"Sorry, No Results.")]',
    zipcode: '',
  },
};
