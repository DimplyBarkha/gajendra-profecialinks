
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    transform: null,
    domain: 'nykaa.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    async function fetchProducts (searchTerm, offset) {
      const productsObject = {};
      const product = await context.evaluate(async function (searchTerm, offset) {
        const response = await fetch(`https://www.nykaa.com/nyk/aggregator-gludo/api/search.list?filter_format=v2&from=${offset}&search=${searchTerm}&source=react#[!opt!]{"type":"json"}[/!opt!]`);
        return response.json();
      }, searchTerm, offset);
      return product;
    };
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    const searchTerm = await context.evaluate(async () => {
      return window.location.href.match(/q=(.+)/)[1];
    });
    const apiResponse = fetchProducts(searchTerm, 0);
    // todo: figure out data structure and populate correct fields
    console.log(apiResponse);
    await stall(20000);
    const dataRef = await context.extract(productDetails, { transform });
    return dataRef;
  },
};
