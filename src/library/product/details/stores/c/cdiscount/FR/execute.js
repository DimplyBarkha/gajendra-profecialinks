
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    domain: 'cdiscount.com',
    loadedSelector: null,
    noResultsXPath: '//img[@alt="404"] | //meta[@property="og:url" and contains(@content,"errorPage")]',
    zipcode: '',
  },
};
