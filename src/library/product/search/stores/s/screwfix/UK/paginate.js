
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'screwfix',
    nextLinkSelector: 'a#next_page_link.btn.pagi__link',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#sticky-right-content',
    noResultsXPath: '//h3[contains(text(),"Hints to improve your search:")]',
    openSearchDefinition: null,
    domain: 'screwfix.com',
    zipcode: "''",
  },
};