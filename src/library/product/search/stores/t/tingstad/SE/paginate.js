
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'tingstad',
    nextLinkSelector: 'label.pagination__item',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.pl__wrap',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'tingstad.se',
    zipcode: "''",
  },
};
