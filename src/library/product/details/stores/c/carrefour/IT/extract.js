
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'carrefour',
    transform: null,
    domain: 'carrefour.it',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      document.querySelector('body').setAttribute('import-enhanced-content', 'false');
      let jsonData = document.querySelector('[type="application/ld+json"]');

      if (jsonData) {
        jsonData = JSON.parse(jsonData.textContent);
        let availability = jsonData.offers.availability;
        availability = availability.includes('InStock') ? 'In stock' : 'Out of stock';
        document.querySelector('body').setAttribute('import-purchasability', availability);
        let images = jsonData.image;

        for (let image of images) {
          image = image.split('?')[0].replace('.jpg', '.png');
          let imgEl = document.createElement('import-image');
          imgEl.setAttribute('data', image);
          document.querySelector('body').appendChild(imgEl);
        }
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  }
};
