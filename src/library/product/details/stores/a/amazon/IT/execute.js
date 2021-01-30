
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    domain: 'amazon.it',
    loadedSelector: 'div#dp',
    noResultsXPath: '//td[@valign="middle"]/b[contains(text(),"Cerchi qualcosa in particolare?")]',
    zipcode: '',
  },
};
