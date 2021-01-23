module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'nemlig',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#searchscrollable div.searchresult__item-container productlist-item',
    noResultsXPath: '//div[@id="searchscrollable"]//h3[@class="contact__subhead" and contains(text(),"Kundeservice sidder klar til at hjælpe dig alle ugens dage")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'nemlig.com',
    zipcode: "''",
  },
};
