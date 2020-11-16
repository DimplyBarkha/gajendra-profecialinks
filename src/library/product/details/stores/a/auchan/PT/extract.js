async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise(res => setTimeout(res, 30000));
  const checkNoresultXpath = async () => {
    return await context.evaluate(() => {
      const check = document.querySelector('div[class*="no-results"]');
      if (check) {
        return true
      } else {
        return false
      }
    })
  }
  const check = await checkNoresultXpath();
  console.log(`this is the value for check ${check}`)
  if (check) {
    console.log('no rows were returned')
    return;
  }
  const addOptionalWait = async (selector) => {
    try {
      await context.waitForSelector(selector, { timeout: 30000 })
      console.log(`${selector} loaded successfully`)
    } catch (e) {
      console.log(`${selector} did not load at all`)
    }
  }
  addOptionalWait('div[class="product-item-header"] > a');
  await context.evaluate(() => {
    const clickDiv = document.querySelector('div[class="product-item-header"] > a');
    if (clickDiv) {
      clickDiv.click()
    }
    const cookiesDiv = document.querySelector('button[id="cookies-accept"]');
    if (cookiesDiv) {
      cookiesDiv.click();
    }
  })
  return await context.extract(productDetails, { transform });
}

const { cleanUp } = require('../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'auchan',
    transform: cleanUp,
    domain: 'auchan.pt',
    zipcode: '',
  },
  implementation,
};
