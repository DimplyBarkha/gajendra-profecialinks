
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'lowes_lg',
    domain: 'lowes.com',
    url: 'https://www.lowes.com/search?searchTerm={searchTerms}',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    loadedSelector: 'div[data-selector="splp-prd-lst-plpo"]',
    noResultsXPath: '//section[@id="main"]/div/h1',
    zipcode: '',
  },
};
