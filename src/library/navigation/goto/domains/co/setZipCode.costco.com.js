
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'costco.com',
    store: 'costco',
    zipcode: '98188',
  },
  implementation: async ({ zipcode }, parameters, context, dependencies) => {
    console.log('SETTING ZIP')
    await context.click('#delivery-postal-change');
    await context.setInputValue('input.form-control[name="deliveryPostalCode"][type="text"]', zipcode);
  },
};
