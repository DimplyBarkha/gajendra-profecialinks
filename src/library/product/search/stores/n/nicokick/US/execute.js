module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'nicokick',
    domain: 'nicokick.com',
    url: 'https://nicokick.com/us/nicotine-pouches/{searchTerms}',
    loadedSelector: 'div#layer-product-list',
    noResultsXPath: '//h1[contains(text(),"00PS!")]',
    zipcode: '',
  },
};
