
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'att',
    // nextLinkSelector: 'li.active + li > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.support-list',
    noResultsXPath: '//div[@class="container inner-container marginTopBottom20"]',
    openSearchDefinition: null,
    domain: 'att.com',
    zipcode: "''",
  },
};
