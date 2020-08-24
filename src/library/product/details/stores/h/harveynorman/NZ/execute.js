module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'harveynorman',
    domain: 'harveynorman.co.nz',
    loadedSelector: 'div#tygh_container',
    noResultsXPath: '//p[contains(text(),"Search was unable to find any results")]',
    zipcode: '',
  },
};
