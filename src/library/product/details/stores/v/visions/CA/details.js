
module.exports = {
  implements: 'product/details',
  parameterValues: {
    country: 'CA',
    store: 'visions',
    domain: 'visions.ca',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { URL, RPC, SKU } = inputs;
    const { execute, extract } = dependencies;
    const url = URL;
    const id = (RPC) || ((SKU) || inputs.id);
    let pageHasResults = await execute({ url, id, zipcode: parameters.zipcode });
    console.log('pageHasResults', pageHasResults);
    if(pageHasResults) {
      await extract({ url, id });
    }
    
  },
};
