const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    if (document.querySelector('div.uc-banner-content')) {
      document.querySelector('button#uc-btn-accept-banner').click();
    }

    const allProducts = document.querySelectorAll('div.search-service-product');

    for (let i = 0; i < allProducts.length; i++) {
      document.querySelectorAll('input[name="listingId"]')[i].setAttribute('rankorganic', `${i + 1}`);

      const gtin = document.querySelectorAll('div.search-service-ProductActions > meso-data')[i].getAttribute('data-productid');
      document.querySelectorAll('input[name="listingId"]')[i].setAttribute('url', `https://shop.rewe.de/p/${gtin}`);
    }
  });

  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'rewe',
    transform: null,
    domain: 'shop.rewe.de',
    zipcode: '',
  },
  implementation,
};
