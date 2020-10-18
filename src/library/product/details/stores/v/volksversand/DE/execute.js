
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'volksversand',
    domain: 'volksversand.de',
    loadedSelector: 'div.product--details',
    noResultsXPath: '//div[@class="html--content"]/h1[contains(.,"Ups ... auf die Nase gefallen.")]',
    zipcode: "''",
  },
};
