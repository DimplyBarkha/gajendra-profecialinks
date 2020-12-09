async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform, mergeType } = parameters;
  const { productReviews } = dependencies;
  try {
    await context.waitForSelector('a[class="button confirmm-age"]', { timeout: 7000 });
  }
  catch (e) {
    console.log('age selector not found');
  }

  let agebutton = await context.evaluate(async function () {
    const ageConfIframe = document.querySelector('a.button.confirmm-age');
    if (ageConfIframe) {
      document.querySelector('a.button.confirmm-age').click();
    }
    return !!ageConfIframe;
  });

  await new Promise(resolve => setTimeout(resolve, 10000));

  try {
    await context.waitForSelector('div[data-review-id]:not(.yotpo-hidden)');
  }
  catch (e) {
    console.log('selector not found', e);
  }

  return await context.extract(productReviews);
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'njoy',
    transform: null,
    domain: 'shop.njoy.com',
    zipcode: "''",
  },
  implementation,
};
