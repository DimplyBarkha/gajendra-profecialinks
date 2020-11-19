const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const delay = t => new Promise(resolve => setTimeout(resolve, t));
  await delay(2000);
  const pId = inputs.id;
  const searchUrl = `https://www.n11.com/arama?q=${pId}`;
  await context.goto(searchUrl, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  let prodUrl = null;
  prodUrl = await context.evaluate(function () {
    if (document.querySelector('section[class*="listingGroup"] ul')) { return document.querySelector('section[class*="listingGroup"] ul[class="clearfix"] a').getAttribute('href'); }
    return null;
  });
  if (prodUrl !== null) {
    await context.goto(prodUrl, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  } else {
    prodUrl = 'https://www.n11.com';
    await context.goto(prodUrl, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    transform,
    domain: 'n11.com',
    zipcode: '',
  },
  implementation,
};
