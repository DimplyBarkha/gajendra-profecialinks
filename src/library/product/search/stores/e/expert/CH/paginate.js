
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'expert',
    nextLinkSelector: "[id*='pageContent'] div[class*='ZZ6v'] button[class*='styled__StyledButton']",
    mutationSelector: "div[id*='productListingContainer'] div[class*='productList']",
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'digitec.ch',
    zipcode: '',
  },
};
