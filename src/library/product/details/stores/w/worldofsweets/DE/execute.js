
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'worldofsweets',
    domain: 'worldofsweets.de',
    loadedSelector: 'div#content',
    noResultsXPath: '//div[@class="content is--fixed"]//a',
    zipcode: "''",
  },
};
