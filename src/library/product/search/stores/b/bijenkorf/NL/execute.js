
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    domain: 'bijenkorf.nl',
    url: 'https://www.debijenkorf.nl/product-lister-page.html?SearchTerm={searchTerms}',
    loadedSelector: 'div[class="load-more-button"]>a',
    noResultsXPath: '//h2[contains(.,"hebben helaas geen")]',
    zipcode: '',
  },
};
