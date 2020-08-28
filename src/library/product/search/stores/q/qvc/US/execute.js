
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    domain: 'qvc.com',
    url: 'https://www.qvc.com/catalog/search.html?keyword=shark{searchTerms}',
    loadedSelector: "div[class*='productGallery'] div[class*='galleryItem']",
    noResultsXPath: "//div[@class='searchResults' and contains(.,'0 results')]",
    zipcode: '',
  },
};
