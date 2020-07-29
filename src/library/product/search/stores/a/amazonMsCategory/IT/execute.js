
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazonMsCategory',
    domain: 'amazon.it',
    url: 'https://www.amazon.it/gp/bestsellers/*/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Cerchi qualcosa in particolare")] | /html[not(//ol/li)] | //a[contains(@href,"ref=cs_503_link")]',
    zipcode: '',
  },
};
