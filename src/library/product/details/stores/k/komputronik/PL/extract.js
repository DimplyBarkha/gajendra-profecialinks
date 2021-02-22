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
  try {
    await context.waitForSelector('div[class*="snrs-reco"]');
  } catch(err) {
    console.log('got some error while waiting for div[class*="snrs-reco"] ->', err.message);
  }
  
  await context.evaluate(() => {
    var elmt = document.getElementsByClassName('snrs-reco-slider')[0];
    if(elmt) {
      elmt.scrollIntoView(true);
    }
  });
  return await context.extract(productDetails, { transform });
}
