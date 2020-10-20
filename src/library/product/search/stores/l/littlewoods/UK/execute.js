
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'littlewoods',
    domain: 'littlewoods.com',
    url: 'https://www.littlewoods.com/e/q/{dyson-pure-cool-me}.end',
    loadedSelector: '#products>ul',
    noResultsXPath: '//*[@id="main"]/div/p[1]/strong/text()',
    zipcode: '',
  },
};
