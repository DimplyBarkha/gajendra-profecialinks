
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazonMsCategory',
    domain: 'amazon.fr',
    url: 'https://www.amazon.fr/gp/bestsellers/*/{searchTerms}',
    noResultsXPath: '//a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Vous recherchez une page")] | /html[not(//ol/li)]',
    zipcode: '',
  },
};
