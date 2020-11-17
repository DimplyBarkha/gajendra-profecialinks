const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'did',
    transform,
    domain: 'did.ie',
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
    try{
      await context.waitForSelector('iframe[id*=flix-iframe]');
    }catch(e){
      console.log('no video present in enhanced content');
    }
    return await context.extract(productDetails, { transform });
  }
};
