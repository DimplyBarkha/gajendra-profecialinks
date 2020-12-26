const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'komputronik',
    transform,
    domain: 'komputronik.pl',
    zipcode: "''",
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForSelector('div[class*="snrs-reco"]');
  await context.evaluate(() => {
    var elmt = document.getElementsByClassName('snrs-reco-slider')[0];
    elmt && elmt.scrollIntoView(true);
  });
  return await context.extract(productDetails, { transform });
}
