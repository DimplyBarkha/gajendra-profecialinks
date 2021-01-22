
module.exports = {
  implements: 'product/details',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    domain: 'elcorteingles.es',
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
    console.log('page has results - ', pageHasResults);
    if(pageHasResults) {
      await extract({ url, id });
    } else {
      console.log('we got a no-results page here!!');
    }
    
  }
};
