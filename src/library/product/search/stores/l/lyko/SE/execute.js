
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'lyko',
    domain: 'lyko.com',
    url: 'https://lyko.com/sv/sok?q=after+shave',
    // url: 'https://lyko.com/sv/sok?q=after+shave',
    loadedXpath: '//div[@class="NNXRtF"]//div/picture/img/@src',
    noResultsXPath: null,
    zipcode: '',
  },
};
