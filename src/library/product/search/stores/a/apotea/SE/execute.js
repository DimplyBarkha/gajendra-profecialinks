
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'apotea',
    domain: 'apotea.se',
    url: 'https://www.apotea.se/sok?q={searchTerms}&x=0&y=0',
    loadedSelector: 'div#search-products div.products5 ul li',
    noResultsXPath: "//span[@id='search-hits-text']/strong[text()=0]",
    zipcode: '',
  },
};
