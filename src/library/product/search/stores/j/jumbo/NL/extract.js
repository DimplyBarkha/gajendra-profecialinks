const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await context.evaluate(() => {
    document.querySelector('div[analytics-tag="product list"]').setAttribute('url', document.location.href);
  });

  return await context.extract(productDetails, { transform }, 'MERGE_ROWS');

  // if (await context.evaluate(() => {
  //   return document.querySelector('span.d-xs-inline.d-l-none');
  // }) !== null) {
  //   do {
  //     await context.evaluate(() => {
  //       document.querySelector('div[analytics-tag="product list"]').setAttribute('url', document.location.href);
  //     });

  //     if (await context.evaluate(() => {
  //       return document.querySelector('span.d-xs-inline.d-l-none');
  //     }) === null || await context.evaluate(() => {
  //       const offSet = window.location.href.match('offSet=([0-9]+)');
  //       return parseInt(offSet[1]) >= 100;
  //     })) {
  //       return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
  //     } else {
  //       await context.extract(productDetails, { transform }, 'MERGE_ROWS');

  //       // waiting for extraction (else throwing error)

  //       await new Promise((resolve) => setTimeout(resolve, 3000));

  //       await context.evaluate(() => {
  //         document.querySelector('span.d-xs-inline.d-l-none').click();
  //       });
  //     }
  //   } while (true);
  // } else {
  //   await context.evaluate(() => {
  //     document.querySelector('div[analytics-tag="product list"]').setAttribute('url', document.location.href);
  //   });

  //   // return extract stops executing extractor

  //   return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
  // }
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    transform,
    domain: 'jumbo.com',
    zipcode: '',
  },
  implementation,
};
