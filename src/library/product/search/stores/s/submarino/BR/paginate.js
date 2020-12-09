
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    nextLinkSelector: 'ul.pagination-product-grid.pagination li:last-child:not([class="disabled"])>a',
    mutationSelector: null,
    spinnerSelector: 'div.loading-bar-spinner',
    loadedSelector: 'div.row.product-grid.no-gutters.main-grid',
    noResultsXPath: '//div[@class="EmptyPage__Container-sc-1u8xkxt-3 wyPSV ViewUI-sc-1ijittn-6 NvLey"]',
    openSearchDefinition: null,
    domain: 'submarino.com.br',
    zipcode: '',
  },
};
