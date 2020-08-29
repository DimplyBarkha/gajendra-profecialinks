
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'GB',
    store: 'qvc',
    nextLinkSelector: "li a:not([class='disabled']) img[class='nxtPage']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "div[class*='productGallery'] div[class*='galleryItem']",
    noResultsXPath: "//div[@class='searchResults' and contains(.,'0 results')]",
    openSearchDefinition: null,
    domain: 'qvcuk.com',
    zipcode: '',
  },
};
