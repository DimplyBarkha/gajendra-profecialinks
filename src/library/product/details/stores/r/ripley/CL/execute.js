
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CL',
    store: 'ripley',
    domain: 'ripley.cl',
    loadedSelector: "section[class='product-options'] div[class='product-options-desktop-wrapper'] div[class='radio-items']",
    noResultsXPath: "//div[@class='error-page-container']//div[@class='error-page']",
    zipcode: '',
  },
};
