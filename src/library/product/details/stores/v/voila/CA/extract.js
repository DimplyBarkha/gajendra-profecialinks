const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'voila',
    transform,
    domain: 'voila.ca',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const url = window.location.href;
      const sku = url.replace(/(.+)products\/(.+)\/details/g, '$2');
      if (sku) {
        document.body.setAttribute('sku', sku);
      }
      if (url) {
        document.body.setAttribute('url', url);
      }
      // @ts-ignore
      const imageData = window.__INITIAL_STATE__.data.products.productEntities;
      const imageArr = imageData[Object.keys(imageData)] && imageData[Object.keys(imageData)].images;
      if (imageArr && imageArr.length) {
        imageArr.forEach(element => {
          const newlink = document.createElement('a');
          newlink.setAttribute('class', 'image');
          newlink.setAttribute('href', element.src);
          newlink.setAttribute('alt', element.description);
          document.body.appendChild(newlink);
        });
      }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
