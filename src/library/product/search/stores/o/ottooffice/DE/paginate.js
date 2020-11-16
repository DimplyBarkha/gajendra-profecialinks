
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'ottooffice',
    nextLinkSelector: '#inner_content > div.col-right-wide > div:nth-child(6) > form > div.pagination-right > div.pager-container.itemlist-setting > a.pager-arrow.pager-next-img',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'otto-office.com',
    zipcode: '',
  },
};
