
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'littlewoods',
    domain: 'littlewoods.com',
    loadedSelector: 'body',
    noResultsXPath: '//*[@id="main"]/div/p[1]/strong/text() and //*[@id="main"]/div/p[1]/strong/span/text()',
    zipcode: '',
  },
};
