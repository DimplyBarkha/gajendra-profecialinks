
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'amicafarmacia',
    nextLinkSelector: 'ff-paging-set[class=""] ff-paging-item[type="nextLink"] input',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#maincontent > div.columns > div.column.main',
    noResultsXPath: '//ff-template[contains(text(),"0 Risultati trovati")]',
    openSearchDefinition: null,
    domain: 'amicafarmacia.com',
    zipcode: "''",
  },
};
