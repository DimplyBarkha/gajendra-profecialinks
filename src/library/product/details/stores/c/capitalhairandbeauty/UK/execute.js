
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'capitalhairandbeauty',
    domain: 'capitalhairandbeauty.co.uk',
    loadedSelector: 'div#ProductDetail',
    noResultsXPath: '//h1[contains(text(),"Page Not Found")]',
    zipcode: "''",
  },
};
