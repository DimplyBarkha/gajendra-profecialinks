
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'nutricaototal',
    domain: 'nutricaototal.com.br',
    url: "https://www.nutricaototal.com.br/catalogsearch/result/?q={searchTerms}",
    loadedSelector: "ol[class='products list items product-items'] li[class='item product product-item'] img[class='product-image-photo']",
    noResultsXPath: "//div[@class='message notice']//div[contains(text(),'A sua pesquisa não retornou resultados')]",
    zipcode: '',
  },
};
