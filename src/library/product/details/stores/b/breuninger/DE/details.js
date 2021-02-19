
module.exports = {
  implements: 'product/details',
  parameterValues: {
    country: 'DE',
    store: 'breuninger',
    domain: 'breuninger.de',
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
    // await extract({ url, id });
    if(pageHasResults) {
      await extract({ url, id });
    }
    
  }
};
