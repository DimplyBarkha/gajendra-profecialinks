const { transform } = require('../shared')
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('div#coiOverlay:not([style*="none"])')
    await context.click('div#coiOverlay:not([style*="none"]) button.coi-banner__accept[aria-label*="JAG"]')
  } catch (error) {
    console.log('cookie pop up not loded', error);
  }
  await context.evaluate(() =>{ 
  async function infiniteScroll () {
    let prevScroll = document.documentElement.scrollTop;
    while (true) {
      window.scrollBy(0, document.documentElement.clientHeight);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const currentScroll = document.documentElement.scrollTop;
      if (currentScroll === prevScroll) {
        break;
      }
      prevScroll = currentScroll;
    }
  }
  infiniteScroll();
})
  
  
  async function paginate () {
    try {
      await context.evaluate(() =>{ 
        document.querySelector('footer.master-foot').scrollIntoView()
      });
        await context.waitForFunction(() => {
          console.log('#endlessLoader', document.querySelector('#endlessLoader'));
          return !document.querySelector('#endlessLoader');
        }, { timeout: 20000 });
    } catch (error) {
      console.log(error);
    }
  }
  let length = await context.evaluate(async function () {
    return document.querySelectorAll('div.mini-product').length;
  });
  let oldLength = 0;
  while (length && length !== oldLength && length <= 150) {
    oldLength = length;
    await paginate();
    length = await context.evaluate(async function () {
      return document.querySelectorAll('div.mini-product').length;
    });
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    transform,
    domain: 'elgiganten.se',
    zipcode: '',
  },
  implementation,
};