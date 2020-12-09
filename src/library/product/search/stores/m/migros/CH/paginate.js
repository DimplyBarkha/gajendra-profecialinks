
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'migros',
    noResultsXPath: "//p[@class='info-message ng-star-inserted']/text()",
    domain: 'migros.ch',
    zipcode: '',
  },
};
