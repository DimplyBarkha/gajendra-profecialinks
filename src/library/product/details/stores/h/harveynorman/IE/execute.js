
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'harveynorman',
    domain: 'harveynorman.ie',
    loadedSelector: 'div[id^="productid"]',
    noResultsXPath: '//h3[contains(text(),"Page Not Found")]',
    zipcode: '',
  },
};
