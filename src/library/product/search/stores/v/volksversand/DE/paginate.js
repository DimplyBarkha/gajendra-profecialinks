
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'volksversand',
    nextLinkSelector: 'a.paging--link.is--active + a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.listing--container',
    noResultsXPath: '//div[@class="alert--content" and contains(text(),"Leider wurden zu Ihrer Suchanfrage keine Artikel gefunden")]',
    openSearchDefinition: null,
    domain: 'volksversand.de',
    zipcode: "''",
  },
};
