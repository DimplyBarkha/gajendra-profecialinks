
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'qvc',
    domain: 'qvc.de',
    url: 'https://www.qvc.de/catalog/search.html?keyword={searchTerms}',
    loadedSelector: "div[class*='productGallery'] div[class*='galleryItem']",
    noResultsXPath: "//div[@class='searchResults' and contains(.,'0 Ergebnisse für')]",
    zipcode: '',
  },
};
