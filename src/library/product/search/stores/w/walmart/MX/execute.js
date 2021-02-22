
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'walmart',
    domain: 'walmart.com.mx',
    url: 'https://super.walmart.com.mx/productos?Ntt={searchTerms}',
    loadedSelector: 'div.infinite-scroll-component__outerdiv',
    noResultsXPath: '//div[contains(@class,"no-results_container__")]//h2[contains(text(),"¡Lo sentimos!")]',
    zipcode: '',
  }, 
};
