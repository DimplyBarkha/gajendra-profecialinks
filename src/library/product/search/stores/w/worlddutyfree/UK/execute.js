
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'worlddutyfree',
    domain: 'worlddutyfree.com',
    url: "https://worlddutyfree.com/en/catalogsearch/result/?q={searchTerms}",
    loadedSelector: "ol[class='products list items product-items'] li[class='item product product-item'] a[class='product photo product-item-photo'] img[class='product-image-photo']",
    noResultsXPath: "//div[@class='message notice']//div[contains(text(),'No exact results found for')]",
    zipcode: '',
  },
};
