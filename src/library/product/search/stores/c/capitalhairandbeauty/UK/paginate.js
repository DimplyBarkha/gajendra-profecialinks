
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'capitalhairandbeauty',
    nextLinkSelector: 'p.paging > a.arrow',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-list',
    noResultsXPath: '//p[contains(text(),"No results found") and contains(@class,"error")]',
    openSearchDefinition: null,
    domain: 'capitalhairandbeauty.co.uk',
    zipcode: "''",
  },
};
