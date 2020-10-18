
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'o2',
    domain: 'o2.co.uk',
    loadedSelector: 'div .image-wrapper img',
    noResultsXPath: '//div[@component-name="headerErrorXXL"]//p',
    zipcode: '',
  },
};
