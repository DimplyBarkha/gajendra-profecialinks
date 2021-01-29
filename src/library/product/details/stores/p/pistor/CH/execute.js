
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'pistor',
    domain: 'pistorone.ch',
    loadedSelector: 'div#prod_detail',
    noResultsXPath: '//div[@id="search_content"]//div[@class="infobox"]|//body[contains(text(), "Product not found")]',
    zipcode: '',
  },
};
