
const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform,
    domain: 'flaconi.de',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('div[class="uc-banner-content"]');
    await context.evaluate(async () => {
      let acceptCookie = document.querySelector('#uc-btn-accept-banner')
      // @ts-ignore
      acceptCookie = acceptCookie ? acceptCookie.click() : '';
    })
  } catch (error) {
    console.log('error: ', error);  
  }
  return await context.extract(productDetails, { transform });
}
