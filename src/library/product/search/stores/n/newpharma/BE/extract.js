const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  async function checkPopups () {
    await context.evaluate(() => {
      const popUp = document.querySelector('div[id="wps_popup"]');
      if (popUp !== null) {
        popUp.remove();
      }
      const popUpSecond = document.querySelector('div[id="js-cookie-policy-popup"]');
      if (popUpSecond !== null) {
        popUpSecond.remove();
      }
    });
  }
  // wating for popUp
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await checkPopups();
  // wating for more popUps
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await checkPopups();

  await context.evaluate(async () => {
    const allProducts = document.querySelectorAll('div.product.js-product-row');
    allProducts.forEach((product, index) => {
      try {
        const productUrl = `https:${product.querySelector('a.details__title').getAttribute('href')}`;
        product.setAttribute('product-url', productUrl);
        const productJson = JSON.parse(product.getAttribute('data-google-360')).ecommerce.click.products[0];
        if (productJson.rating.match(/\d(.\d)?/)) {
          product.setAttribute('product-rating', productJson.rating.match(/\d(.\d)?/)[0].replace('.', ','));
        }
        const reviewCount = product.querySelector('a[id*=listing_reviews') ? product.querySelector('a[id*=listing_reviews').textContent.match(/\d+/)[0] : '0';
        product.setAttribute('product-reviews', reviewCount);
        if (productJson.brand) product.setAttribute('product-manufacturer', productJson.brand);
      } catch (e) {
        console.log('Error extracting product json');
      }
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'newpharma',
    transform: transform,
    domain: 'newpharma.be',
    zipcode: "''",
  },
  implementation,
};
