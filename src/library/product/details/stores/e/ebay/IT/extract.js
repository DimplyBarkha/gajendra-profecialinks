// const { implementation } = require('../shared');
const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'ebay',
    transform,
    domain: 'ebay.it',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('iframe#desc_ifr');
  } catch (err) {
    console.log('manufacturer contents not loaded or unavailable');
  }
  const src = await context.evaluate(async function () {
    const iframe = document.querySelector('iframe#desc_ifr');
    // @ts-ignore
    const src = iframe ? iframe.src : '';
    return src;
  });

  async function scrollToRec() {
    await context.evaluate(async () => {
      var element = (document.querySelector('#rpdCntId, .prodDetailDesc')) ? document.querySelector('#rpdCntId, .prodDetailDesc') : null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 20000);
        });
      }
    });
  }
  await scrollToRec();

  async function checkUPDP() {
    await context.evaluate(async () => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      try {
        var updp = document.querySelectorAll('div#promobox div.froopromotitle');
        if (updp) {
          console.log('UPDP found');
          updp.forEach(item => {
            addElementToDocument('updp_item', item.innerText);
            console.log('added UPDP1 element');
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 10000);
          });
        }
      } catch (e) {
        console.log('unInterruptedPDP not found');
      }
      try {
        var updp1 = document.querySelectorAll('div.mfe-recos-container div[class*= "mfe-title"] >span');
        if (updp1) {
          console.log('UPDP1 found');
          updp1.forEach(item => {
            addElementToDocument('updp_item', item.innerText);
            console.log('added UPDP1 element');
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 10000);
          });
        }
      } catch (e) {
        console.log('unInterruptedPDP1 not found');
      }
    });
  }
  console.log('UPDP started');
  await checkUPDP();
  console.log('UPDP ended');

  await context.extract(productDetails, { transform });
  if (src) {
    try {
      await context.setBypassCSP(true);
      await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      await context.waitForSelector('div#ds_div');
    } catch (error) {
      try {
        await context.setBypassCSP(true);
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('div#ds_div');
      } catch (error) {
        console.log('could not load page', error);
      }
    }
  }
  return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
}