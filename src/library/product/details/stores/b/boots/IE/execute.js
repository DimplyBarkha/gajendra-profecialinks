
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'boots',
    domain: 'boots.ie',
    loadedSelector: 'canvas',
    noResultsXPath: '/html[not(//meta[@name="pageName"][@content="ProductPage"])] | //span[contains(text(),"This product has either been removed or is no longer available for sale.")]',
    zipcode: '',
  },
};
