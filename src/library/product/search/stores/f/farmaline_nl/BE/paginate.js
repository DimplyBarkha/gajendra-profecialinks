
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BE',
    store: 'farmaline_nl',
    nextLinkSelector: 'div.item.last.pager>ul>li:last-child>a.next',
    spinnerSelector: 'div#loadingPane',
    loadedSelector: 'ul.productlist.clearfix',
    noResultsXPath: '//div[@data-reactroot]/div[contains(.,"Geen producten gevonden")]',
    domain: 'farmaline.be',
    zipcode: '',
  },
};
