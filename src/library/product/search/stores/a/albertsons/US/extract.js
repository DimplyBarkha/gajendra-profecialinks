const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'albertsons',
    transform,
    domain: 'albertsons.com',
    zipcode: '83642',
  },
  // implementation: async function (
  //   inputs,
  //   parameters,
  //   context,
  //   dependencies,
  // ) {
  //   const { productDetails } = dependencies;
  //   const { transform } = parameters;
  //   await context.evaluate(() => {
  //     var searchUrl = window.location.href;
  //     var appendElements = document.querySelectorAll('div[class="card-body"]');
  //     if (appendElements.length) {
  //       appendElements.forEach((element) => {
  //         element.setAttribute('searchurl', searchUrl);
  //       })
  //     }
  //   });
  //   return await context.extract(productDetails, { transform });
  // }
};
