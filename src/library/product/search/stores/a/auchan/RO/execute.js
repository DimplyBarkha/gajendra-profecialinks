
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RO',
    store: 'auchan',
    domain: 'auchan.ro',
    // url: 'https://www.auchan.ro/store/search?q={searchTerms}%3Arelevance%3AproductStatuses%3AToate+produsele&page=1&view=grid&pageSize=48'
    url: 'https://www.auchan.ro/store/search/?text={searchTerms}&pageSize=96',
    loadedXpath: 'div.row.productGrid div.productGridItem.listing',
    // noResultsXPath: '//b[contains(.,"Niciun produs nu corespunde cautarii tale.")]',
    zipcode: '',
  },
};
