async function implementation (inputs, parameters, context, dependencies) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
}
module.exports = {
  implements: 'product/search',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    domain: 'petlove.com.br',
    zipcode: '',
  },
  implementation,
};
