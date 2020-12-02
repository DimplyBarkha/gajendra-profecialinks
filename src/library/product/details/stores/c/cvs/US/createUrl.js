
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'cvs.com',
    prefix: null,
    country: 'US',
    store: 'cvs',
    // url: 'https://www.cvs.com/shop-assets/proxy/search?query={id}&skip=0&pageSize=50&fields=%5B%22*%22%2C%22id%22%5D&orFields=%5B%22variants.subVariant.availability%22%5D&refinements=%5B%5D',
  },
  implementation: async(
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    console.log(`--------- createUrl ------------`);
    const { URL, RPC, SKU } = inputs;
    const { execute, extract } = dependencies;
    let url = URL;
    let id = (RPC) || ((SKU) || inputs.id);

    if (id) {
      url = `https://www.cvs.com/shop-assets/proxy/search?query=${id}&skip=0&pageSize=50&fields=%5B%22*%22%2C%22id%22%5D&orFields=%5B%22variants.subVariant.availability%22%5D&refinements=%5B%5D`;
    }

    if (url) {
      let sku = url.match(/\d+/g);
      sku = sku.length ? sku[0] : null;
      url = `https://www.cvs.com/shop-assets/proxy/search?query=${sku}&skip=0&pageSize=50&fields=%5B%22*%22%2C%22id%22%5D&orFields=%5B%22variants.subVariant.availability%22%5D&refinements=%5B%5D`;
    }
    // console.log(`--------- Here we goooo --------`);
    // if (url) {
    //   let sku = url.match(/\d+/g);
    //   sku = sku.length ? sku[0] : null;
    //   id = sku;
    // }
    // console.log(`--------- ID: ${id} ------------`);
    await context.execute({ url, id, zipcode: parameters.zipcode });
    await context.extract({ url, id });
  },
};