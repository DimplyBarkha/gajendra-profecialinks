
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    transform: null,
    domain: 'carrefour.fr',
    zipcode: '',
    implementation: async (inputs,
      parameters,
      context,
      dependencies,
    ) => {
      await context.evaluate(async function () {
      // @ts-ignore
      const productData = window.ONECF_INITIAL_STATE;
      const purchasability = productData.search.data.attributes.availability.purchasable;
      const availability = purchasability ? 'In stock' : 'Out of stock';
      document.querySelector('body').setAttribute('import-purchasability', purchasability);
      document.querySelector('body').setAttribute('import-availability', availability);
      const { transform } = parameters;
      const { productDetails } = dependencies;
      return await context.extract(productDetails, { transform });
    }
  },
};
