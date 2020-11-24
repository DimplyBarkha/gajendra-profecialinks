
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    nextLinkSelector: 'body > div.e2-page.e2-page--scrolled > main > div.container-fluid-mobile.container-fluid-mobile--search-grid.pagecontent > div.row.no-gutters--mobile.no-gutters--tablet > div.yCmsContentSlot.col-12.col-lg-9 > div > div > e2-loading > v-root > div > v-slot > v-slot-assigned-content > div.pager.plp-paginator__pager.pager--mobile-bottom > div > e2-plp-page-selectors:nth-child(6) > v-root > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'kruidvat.nl',
    zipcode: '',
  },
};
