
module.exports = {
  implements: 'product/details',
  parameterValues: {
    country: 'CL',
    store: 'paris',
    domain: 'paris.cl',
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
    const zipcode = inputs.zipcode || parameters.zipcode;
    let canMoveAhead = await execute({ url, id, zipcode });
    
    if(canMoveAhead) {
      await extract({ url, id });
    }
    
  }
};
