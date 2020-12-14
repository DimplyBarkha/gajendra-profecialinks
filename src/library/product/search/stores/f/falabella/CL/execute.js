
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CL',
    store: 'falabella',
    domain: 'falabella.com',
    url: 'https://www.falabella.com/falabella-cl/search?Ntt={searchTerms}',
    loadedSelector: 'div.jsx-1987097504,main',
    noResultsXPath: '//div[contains(@class,"no-result")]//h3',
    zipcode: '',
  },
};
