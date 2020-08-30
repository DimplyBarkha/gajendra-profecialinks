
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GB',
    store: 'qvc',
    domain: 'qvcuk.com',
    url: 'https://www.qvcuk.com/catalog/search.html?keyword={searchTerms}',
    loadedSelector: "div[class*='productGallery'] div[class*='galleryItem']",
    noResultsXPath: "//div[@class='searchResults' and contains(.,'0 results')] | //*[not(//div[contains(@class,'productGallery')]//div[contains(@class,'galleryItem')])]",
    zipcode: '',
  },
};
