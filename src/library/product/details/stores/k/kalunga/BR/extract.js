const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'kalunga',
    transform,
    domain: 'kalunga.com.br',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForSelector('.stars');
    await context.evaluate(() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      const script = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].innerHTML);
      if (script) {
        if (script.brand) addElementToDocument('brandName', script.brand.name);
        if (script.sku) addElementToDocument('sku_number', script.sku);
        if (script.sku) addElementToDocument('sku_code', script.sku);
        if (script.gtin) addElementToDocument('ean_gtin', script.gtin);
      }
    });
    return await context.extract(productDetails, { transform });
  }
};
