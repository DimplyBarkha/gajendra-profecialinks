const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(1000);
      scrollTop += 500;
      if (scrollTop === 10000) {
        break;
      }
    }
    
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    transform,
    domain: 'tesco.com',
  },
  // dependencies: {
  //   productDetails: 'extraction:product/search/stores/${store[0:1]}/${store}/${country}/extract',
  // },
  
  // implementation: async ({ inputString }, { country, store, transform }, context, dependencies) => {
  //   function stall (ms) {
  //     return new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //         resolve();
  //       }, ms);
  //     });
  //   }
  //   const getAPIData = async function () {
  //     const page = window.location.href.match(/page=([^&]+)/) ? window.location.href.match(/page=([^&]+)/)[1] : 1;
  //     const query = decodeURI(window.location.href.match(/query=([^&]+)/) && window.location.href.match(/query=([^&]+)/)[1]);
  //     const body = {
  //       acceptWaitingRoom: true,
  //       resources: [{ type: 'search', params: { query: { page, query } } }],
  //     };
  //     const csrf = document.querySelector('[data-csrf-token]').getAttribute('data-csrf-token');
  //     const response = await fetch('https://www.tesco.com/groceries/en-GB/resources', {
  //       headers: {
  //         'content-type': 'application/json',
  //         'x-csrf-token': csrf,
  //       },
  //       body: JSON.stringify(body),
  //       method: 'POST',
  //       mode: 'cors',
  //     });
  //     const data = await response.json();
  //     return data;
  //   };
  //   try {
  //     const data = await context.evaluate(getAPIData);
  //     await stall(1000);
  //     await context.evaluate((data) => {
  //       data.search.data.results.productItems.forEach(elm => {
  //         const id = elm.product.id;
          
  //         if(elm.product.defaultImageUrl != null) {
  //           document.querySelector(`#tile-${id}`).setAttribute('thumbnail', elm.product.defaultImageUrl);
  //         }          
  //       });
  //     }, data);
  //     return await context.extract(dependencies.productDetails, { transform });
  //   } catch (err) {
  //     console.log({ err });
  //     throw new Error('Error when calling API');
  //   }
  // },
  implementation,
};
