const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // removing iframe popup on every page of search results
  // the popup is visible after a moment -> delaying the removal
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const isPopupPresent = await context.evaluate(async () => {
    return document.querySelector('div.truste_box_overlay');
  });
  if (isPopupPresent !== null) {
    await context.evaluate(() => {
      document.querySelector('div.truste_box_overlay').remove();
      document.querySelector('div.truste_overlay').remove();
    });
  }

  await context.evaluate(() => {
    const searchUrl = window.location.href;
    document.querySelector('body').setAttribute('searchurl', searchUrl);
  });

  var dataRef = await context.extract(productDetails, { transform });
  // dataRef[0].group.forEach((row) => {
  //   const rating = row.aggregateRating2;
  //   if (rating) {
  //     rating[0].text = rating[0].text.replace('.', ',');
  //   }
  // });
  return dataRef;
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage_10101',
    transform: transform,
    domain: 'staplesadvantage.com',
    zipcode: '10101',
  },
  implementation,
};
