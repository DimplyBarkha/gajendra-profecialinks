
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PE',
    store: 'Juntoz_Enfabebe',
    transform: null,
    domain: 'enfabebe.juntoz.com',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
    window.location.reload()
    
    });
    await new Promise(r => setTimeout(r, 6000));
    await context.extract(productDetails);
    },
    };
    
