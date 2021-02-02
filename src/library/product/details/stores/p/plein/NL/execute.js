
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    domain: 'plein.nl',
    //loadedSelector: 'div.owl-item.active img.owl-lazy',
    noResultsXPath: '//div[@class="container"]/div[contains(.,"Probeer eens een merknaam of beschrijving van je product in te typen.")]',
    zipcode: '',
  },
};
