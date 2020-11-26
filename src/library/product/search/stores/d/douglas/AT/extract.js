const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    transform,
    domain: 'douglas.at',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.evaluate(() => {
      // @ts-ignore
        const products = [...document.querySelectorAll('.product-tile__main-link-wrapper')];
        products.forEach(async (product) => {
          let url = product.querySelector('a').getAttribute('href');
          url = url.split('/');
          let prodId = '';
          if (url[3]) {
            const params = url[3].split('?variant=');
            if (params.length === 1) {
              prodId = params[0];
            } else if (params.length === 2) {
              prodId = params[1];
            }
          }
          const res = await fetch(`https://www.douglas.at/api/v2/products/${prodId}`);
          const data = await res.json();
          if (data.code) {
            product.setAttribute('sku', data.code);
          }
          if (data.numberOfReviews) {
            product.setAttribute('review-count', data.numberOfReviews);
          }
          if (data.averageRating) {
            let aggregateRating = data.averageRating.toString();
            aggregateRating = aggregateRating.replace('.', ',');
            product.setAttribute('aggregate-rating', aggregateRating);
          }
          if (data.ean) {
            product.setAttribute('gtin', data.ean);
          }
          if (data.price) {
            product.setAttribute('price', data.price.formattedValue);
          }

          const currentUrl = window.location.href;
          product.setAttribute('search-url', currentUrl);
        });
      });
    } catch (e) {
      console.log(e.message);
    }
    return await context.extract(productDetails, { transform });
  },
};
