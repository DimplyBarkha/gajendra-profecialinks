
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'harveynorman',
    domain: 'harveynorman.com.au',
    loadedSelector: 'div#media img',
    noResultsXPath: '//h2[contains(text(),"gone wrong!")]',
    zipcode: '',
  },
};
