const { cleanUp } = require('../shared')
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('iframe[id*="widget2"]', { timeout: 30000 });
    console.log('iframe loaded successfully');
  } catch (e) {
    console.log('iframe did not load at all');
  }
  await context.evaluate(async () => {
    await new Promise((res) => setTimeout(res, 30000));
    const frame = document.querySelector('iframe[id*="widget"]');
    const url = frame && frame.getAttribute('src');
    const appendElement = document.querySelector('span[class*="number current"]');
    appendElement.setAttribute('videourl', url);
  })
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'bezokularow',
    transform: cleanUp,
    domain: 'bezokularow.pl',
    zipcode: '',
  },
  implementation,
};
