
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'JP',
    store: 'yahoo',
    domain: 'yahoo.co.jp',
    loadedSelector: 'div#shpMain',
    noResultsXPath: '//p[contains(text(),"商品情報を表示できません")]',
    zipcode: '',
  },
};
