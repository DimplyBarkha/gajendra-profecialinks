const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // To load all images. Initially it has blob as a src but it loads image url after some time.
  await new Promise((resolve, reject) => setTimeout(resolve, 20000));
  async function paginate () {
    try {
      const hasNextLink = await context.evaluate(() => !!document.querySelector('a.load-more-button__anchor'));
      if (hasNextLink) {
        await Promise.all([
          context.click('a.load-more-button__anchor'),
          // possible race condition if the data returned too fast, but unlikely
          context.waitForMutuation('ul.productlist__list', { timeout: 20000 }),
        ]);
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.log(error);
    }
  }
  let length = await context.evaluate(async function () {
    return document.querySelectorAll('ul.productlist__list > li').length;
  });
  let oldLength = 0;
  while (length && length !== oldLength && length <= 150) {
    oldLength = length;
    await paginate();
    length = await context.evaluate(async function () {
      return document.querySelectorAll('ul.productlist__list > li').length;
    });
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    transform,
    domain: 'debijenkorf.nl',
    zipcode: '',
  },
  implementation,
};
