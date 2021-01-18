const { transform } = require('./transform');

async function implementation(
  inputs,
  parameters,

  context,
  dependencies,

) {
  const { transform } = parameters;

  const optionalWaiter = async (selector) => {
    try {
      await context.waitForSelector(selector, { timeout: 15000 });
      return true;
    } catch (e) {
      console.log(`Selector didn't load => ${selector}`);
      return false;
    }
  };

  const captcha = await optionalWaiter('#g-recaptcha');

  if (captcha) {
    await context.evaluateInFrame('iframe[src*="recaptcha/api2"], iframe[_src*="recaptcha/api2"]', () => grecaptcha.execute());

    console.log('Captcha solved, waiting for product to load.');
    await optionalWaiter('div.items-grid-view > div > div > a img');
  }

  async function addUrl() {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      // el.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('added-searchurl', url);
  }
  await context.evaluate(addUrl);
  return await context.extract(dependencies.productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'newegg',
    transform: transform,
    domain: 'newegg.com',
    zipcode: "''",
    timeout: null,
  },
  implementation,
  dependencies: {
    productDetails: 'extraction:product/search/stores/${store[0:1]}/${store}/${country}/extract',
  },
};
