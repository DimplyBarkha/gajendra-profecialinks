module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    nextLinkSelector: 'div.responsiveProductListPage_bottomPagination nav ul li:nth-child(6) button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "body",
    domain: 'lookfantastic.com',
    zipcode: ''
  },
};
