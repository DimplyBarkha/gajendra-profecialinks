
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    loadedSelector: null,
    noResultsXPath: `//div[@data-test = 'no-result-content'] | //p[@data-test = 'page-subTitle']`,
    domain: 'bol.com',
    zipcode: '',
  },
};
