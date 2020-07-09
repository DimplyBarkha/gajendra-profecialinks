
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    transform: null,
    domain: 'staples.co.uk',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await new Promise(resolve => setTimeout(resolve, 5000));
  // await context.waitForSelector('#btnCookieContainer');
  await context.evaluate(async function () {
    // @ts-ignore
    document.querySelector('#VATSelectionTakeOver') && document.querySelector('input[value="Show price Inc. VAT"').click();
    // @ts-ignore
    document.querySelector('#btnCookieContainer') && document.querySelector('input[class="accept-all-cookies"').click();
    if (document.querySelector('#btnCookieContainer')) {
      document.querySelector('#btnCookieContainer') && document.querySelector('input[class="accept-all-cookies"').click();
    }
  });
  // await context.waitForSelector('#VATSelectionTakeOver');
  // await context.evaluate(async function () {
  //   // @ts-ignore
  //   // document.querySelector('#VATSelectionTakeOver') &&
  //   document.querySelector('input[value="Show price Inc. VAT"').click();
  // });
  return await context.extract(productDetails);
}
