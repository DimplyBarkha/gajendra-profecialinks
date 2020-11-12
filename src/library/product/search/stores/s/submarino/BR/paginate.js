
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    nextLinkSelector: 'li[class=""] span[aria-label="Next"',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.row.product-grid.no-gutters.main-grid',
    noResultsXPath: '//div[@class="EmptyPage__Container-sc-1u8xkxt-3 wyPSV ViewUI-sc-1ijittn-6 NvLey"]',
    openSearchDefinition: null,
    domain: 'submarino.com.br',
    zipcode: '',
  },
};
