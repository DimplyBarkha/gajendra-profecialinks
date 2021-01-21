
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'procurator',
    nextLinkSelector: 'ul.pagination li.hide-for-small a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'a.item-box-image img',
    noResultsXPath: '//h2[contains(text(),"Tyvärr så gav din sökning " )]',
    openSearchDefinition: null,
    domain: 'procurator.net',
    zipcode: '',
  },
};
