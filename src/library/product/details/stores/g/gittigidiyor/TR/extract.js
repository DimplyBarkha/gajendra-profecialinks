async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
  });
  await context.waitForSelector('ul[class*="catalog-view"]>li img', { timeout: 45000 }).catch((err) => { console.log('Selector not present', err.message); });
  const checkNoResultXpath = async (xpath) => {
    return await context.evaluate((xpath) => {
      return Boolean(document.evaluate(xpath, document) && document.evaluate(xpath, document).iterateNext());
    }, xpath);
  };
  const noResultXpath = '//span[contains(text(),"Bu ürün kapanmıştır")]';
  const isPresent = await checkNoResultXpath(noResultXpath);
  if (isPresent) {
    return;
  }
  const addOptionalWait = async (selector) => {
    try {
      await context.waitForSelector(selector, { timeout: 60000 });
      console.log(`${selector}-------------loaded successly`);
    } catch (e) {
      console.log(`${selector}--------------did not load at all`);
    }
  };
  const enhancedContentSelector = 'div[id=\'sp-desktopDescription\']';
  const imageSelector = 'img[id=\'big-photo\']';
  addOptionalWait(enhancedContentSelector);
  addOptionalWait(imageSelector);
  await context.evaluate(() => {
    const script = document.querySelectorAll('script[type="application/ld+json"]');
    // @ts-ignore
    const ourScript1 = script && [...script].find(element => element.innerText.includes('sku'));
    const dataObjext = ourScript1 && ourScript1.innerText && ourScript1.innerText.trim();
    const jsonData = JSON.parse(dataObjext);
    const sku = jsonData && jsonData.mainEntity && jsonData.mainEntity.offers && jsonData.mainEntity.offers.itemOffered && jsonData.mainEntity.offers.itemOffered[0] && jsonData.mainEntity.offers.itemOffered[0].sku;
    const skuElement = document.createElement('div');
    skuElement.className = 'skuinfo';
    skuElement.setAttribute('sku', sku);
    document.body.append(skuElement);
  });
  async function scrollToRec (node) {
    await context.evaluate(async (node) => {
      const element = document.querySelector(node) || null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
      }
    }, node);
  }
  await scrollToRec('div#TabsCon');
  await scrollToRec('div.footer');
  await scrollToRec('div.boxContent');
  //   await context.waitForSelector('div#userInterestedContainer', { timeout: 20000 })
  //   addOptionalWait('div#userInterestedContainer');
  //   await scrollToRec('div#userInterestedContainer');
  //   await context.waitForSelector('div#user-interested-products', { timeout: 20000 })
  //   addOptionalWait('div#user-interested-products');
  //   await scrollToRec('div#user-interested-products');
  //   await context.waitForSelector('ul#recommendation-products', { timeout: 20000 })
  addOptionalWait('ul#recommendation-products');
  await scrollToRec('ul#recommendation-products');
  await new Promise((resolve, reject) => setTimeout(resolve, 15000));
  try {
    await context.waitForSelector('ul#recommendation-products li', { timeout: 25000 });
  } catch (e) {
    console.log('Not loading rec products');
  }
  console.log('window.latestProducts');
  await context.evaluate(() => {
    console.log(window);
    // @ts-ignore
    console.log(window.latestProducts);
    console.log('esting');
  });
  return await context.extract(productDetails, { transform });
}
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'gittigidiyor',
    transform,
    domain: 'gittigidiyor.com',
    zipcode: '',
  },
  implementation,
};
