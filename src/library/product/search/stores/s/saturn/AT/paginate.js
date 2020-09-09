
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'saturn',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: 'ul[class="products-list"] a[class="photo clickable"]',
    noResultsXPath: '//div[@id="search_no_result-bottom_right"] | /html[not(//script[contains(text(),"Search Results")])]',
    openSearchDefinition: null,
    domain: 'saturn.at',
    zipcode: '',
  },
};
