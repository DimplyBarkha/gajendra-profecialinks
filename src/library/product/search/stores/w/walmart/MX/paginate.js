
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'walmart',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.infinite-scroll-component__outerdiv',
    noResultsXPath: '//div[contains(@class,"no-results_container__")]//h2[contains(text(),"¡Lo sentimos!")]',
    openSearchDefinition: null,
    domain: 'walmart.com.mx',
    zipcode: '',
  },
};
