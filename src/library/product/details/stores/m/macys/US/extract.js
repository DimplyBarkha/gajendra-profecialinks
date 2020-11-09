const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'macys',
    transform: cleanUp,
    domain: 'macys.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      let id = JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_id ? JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_id[0]: "";
      let upc = JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_upc ? JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_upc[0]: "";
      let sku;

      if (id && upc) {
        sku = id + '_' + upc;
      } else if(!upc) {
        sku = id;
      }

      document.body.setAttribute('productsku', sku);
      let product_rating = JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_rating ? JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_rating[0]: "";
      let product_review = JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_reviews ? JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_reviews[0]: "";

      if (product_rating && product_review){
        document.body.setAttribute('productrating', product_rating);
        document.body.setAttribute('productreview', product_review);
      }

    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
