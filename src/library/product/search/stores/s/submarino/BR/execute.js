
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    domain: 'submarino.com.br',
    url: 'https://www.submarino.com.br/busca/{searchTerms}',
    loadedSelector: 'div.row.product-grid.no-gutters.main-grid',
    noResultsXPath: '//div[@class="EmptyPage__Container-sc-1u8xkxt-3 wyPSV ViewUI-sc-1ijittn-6 NvLey"]',
    zipcode: '',
  },
};
