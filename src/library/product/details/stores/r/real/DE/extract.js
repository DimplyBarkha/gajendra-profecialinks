const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'real',
    transform: cleanUp,
    domain: 'real.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // XPATH Data Extraction For Aggregate Rating
      // @ts-ignore
      const aggregateRating = window.dataLayer[0].product.rating_average;
      addElementToDocument('addedAggregateRating', aggregateRating);
      // @ts-ignore
      // XPATH Data Extraction For Shipping Info
      const deliveryDuration = window.dataLayer[0].product.offers[0].delivery_duration;
      // @ts-ignore
      const ShippingCost = window.dataLayer[0].product.offers[0].shipping_cost;
      addElementToDocument('shippingInfo', 'delivery Duration:' + deliveryDuration + ', Shipping Charges:' + ShippingCost);
      // @ts-ignore
      const quantity = window.document.getElementById('amount').value;
      addElementToDocument('quantity', quantity);
    });
    await context.extract(productDetails);
  },
};
