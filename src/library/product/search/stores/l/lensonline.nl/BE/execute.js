
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'lensonline.nl',
    domain: 'lensonline.nl',
    url: 'https://www.lensonline.nl/nl/search/0/lentilles/?s={searchTerms}&c=All',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
