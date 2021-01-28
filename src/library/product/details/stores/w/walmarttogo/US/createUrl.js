async function implementation (inputs,parameters,context,dependencies) {
  const { id } = inputs;
  const { domain, prefix, suffix } = parameters;

  if (parameters.url) {
    let storeId = inputs.storeId || 5334;
    let zipcode = inputs.zipcode || '';
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    return url + `&storeId=${storeId}#zipcode=${zipcode}`;
  }
}
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'walmarttogo.api',
    prefix: null,
    url: 'https://www.walmart.com/grocery/v3/api/products/{id}?itemFields=all&nutritionPrescriptive=true',
    country: 'US',
    store: 'walmarttogo',
  },
  implementation
};
