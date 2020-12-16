const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  await context.evaluate(function () {
    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 30000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    const acceptCookies = document.querySelector('a[id="cookies-agree"]');
    if (acceptCookies) {
      acceptCookies.click();
      optionalWait('//*[contains(@class, "content-list-reviews")]');
    }
  });
  try {
    await context.waitForSelector('//*[contains(@class, "content-list-reviews")]', { timeout: 30000 });
  } catch (err) {
    console.log('Couldn\'t load selector => //*[contains(@class, "content-list-reviews")]');
  }
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    transform,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
  implementation,
};
