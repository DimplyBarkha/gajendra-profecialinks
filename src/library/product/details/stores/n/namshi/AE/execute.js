
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'namshi',
    domain: 'namshi.com',
    loadedSelector: 'div#product_carousel',
    noResultsXPath: '//div[@id="section_404_container"]',
    zipcode: "''",
  },
};
