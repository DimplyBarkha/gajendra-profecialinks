
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'krefel',
    nextLinkSelector: "a[class='next']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "section[class='products-overview tile']",
    noResultsXPath: "//div[@class='no-result-content']",
    openSearchDefinition: null,
    domain: 'krefel.be',
    zipcode: '',
  },
};
