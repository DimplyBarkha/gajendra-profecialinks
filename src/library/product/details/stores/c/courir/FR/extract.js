const { transform } = require('./shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    console.log('Extracting data.');
    const availability = document.evaluate('//button[@id="add-to-cart"][@value="Ajouter"]', document).iterateNext();
    const productPage = document.querySelector('span[class="product-name"][itemprop="name"]');
    let availabilityText = '';
    if (availability) {
      const text = availability.textContent;
      if (text) {
        availabilityText = 'In Stock';
        document.body.setAttribute('available', availabilityText);
      }
    } else {
      if (productPage) {
        availabilityText = 'Out of Stock';
        document.body.setAttribute('available', availabilityText);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'courir',
    transform,
    domain: 'courir.com',
    zipcode: '',
  },
  implementation,
};
