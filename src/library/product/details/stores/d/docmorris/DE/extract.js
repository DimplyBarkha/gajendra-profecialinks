const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    const selector = document.querySelector('span[id="cmpwelcomebtnyes"] a');
    if (selector) {
      selector.click();
    }
    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 10000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    optionalWait('div.container-fluid img[data-initial-size="large"]');
    const directionsTab = document.querySelector('li[class="tab2"] a');
    if (directionsTab) {
      directionsTab.click();
    }
    const mpc = document.evaluate('//script[@type="application/ld+json"][contains(.,"mpn")]', document).iterateNext();
    if (mpc) {
      let mpn = mpc.textContent.split('"mpn": "')[1].split('",')[0];
      document.querySelector('h1[itemprop="name"]').setAttribute('mpc', mpn);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    transform,
    domain: 'docmorris.de',
    zipcode: '',
  },
  implementation,
};
