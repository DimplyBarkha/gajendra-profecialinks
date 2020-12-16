
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    domain: 'homedepot.ca',
    // loadedSelector: 'main[evtperfname="product-container"], div[class="hdca-product"]',
    loadedSelector: 'main[evtperfname="product-container"], div[class="hdca-product"], div[class*="hdca-form-field"]',
    noResultsXPath: '//product-not-found-container[@evtperfname="product-not-found-container"]//div[contains(text(), "temporarily unavailable")]',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    if (inputs.id !== undefined) {
      const prodRpc = inputs.id;
      const prodUrl = `https://www.homedepot.ca/product/${prodRpc}`;
      await context.goto(prodUrl, { first_request_timeout: 60000, timeout: 10000, waitUntil: 'load', checkBlocked: true });
      //   await context.evaluate(async function (prodRpc) {
      //     function stall (ms)
      //     {
      //     return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //     resolve();
      //     }, ms);
      //     });
      //     }
      // console.log(prodRpc+' is product rpc');

    //   },prodRpc);
    }
  },
};
