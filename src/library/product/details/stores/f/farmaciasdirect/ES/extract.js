const implementation = async (inputs, parameters,context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;



  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'farmaciasdirect',
    transform: null,
    domain: 'farmaciasdirect.com',
    zipcode: '28001',
  },
  implementation,
};
