
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'nutricaototal',
    domain: 'nutricaototal.com.br',
    loadedSelector: "div[data-gallery-role='stage-shaft'] div[data-active='true'] img[class='fotorama__img']",
    noResultsXPath: "//span[text()='Ops algo deu errado =(']",
    zipcode: '',
  },
};
