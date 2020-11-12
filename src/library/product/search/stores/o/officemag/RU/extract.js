const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'officemag',
    transform,
    domain: 'officemag.ru',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      const products = document.querySelectorAll('div.Content__group ul.listItems>li');
      products.forEach(product => {
        const starsStyleWidth = product.querySelector('span[class="Score__fill"]').getAttribute('style');
        const starValue = Number(starsStyleWidth.match(/(\d+.\d+)/g)) / 20;
        const ratingAttribute = starValue.toFixed(1).replace('.', ',');
        product.setAttribute('rating', ratingAttribute);
        const productDataObject = JSON.parse(product.getAttribute('data-ga-obj'));
        for (const property in productDataObject) {
          if (property === 'price') {
            productDataObject[property] = productDataObject[property].replace('.', ',');
          }
          product.setAttribute(property, productDataObject[property]);
        }
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
