
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'asna',
    domain: 'asna.ru',
    loadedSelector: "div[class='pic pic-slider'] div[class *='pic-img'] img[class *='js-main-item-photo']",
    noResultsXPath: "//h1[@class='center' and text()='404. Страница не найдена']",
    zipcode: '',
  },
};
