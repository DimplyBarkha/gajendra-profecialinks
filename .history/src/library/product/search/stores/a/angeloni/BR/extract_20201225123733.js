const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'angeloni',
    transform,
    domain: 'angeloni.com.br/super',
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
    // await context.setJavaScriptEnabled(true);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.evaluate(async() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

    })
    return await context.extract(productDetails, {transform});
  },
};
