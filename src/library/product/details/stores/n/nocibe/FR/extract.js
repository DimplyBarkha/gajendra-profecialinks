
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'nocibe',
    transform: cleanUp,
    domain: 'nocibe.fr',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const url = await context.evaluate(async () => {
      // @ts-ignore
      if (window !== undefined) {
        return window.location.href;
      }
    });

    const iFrameSrc = await context.evaluate(async () => {
      // @ts-ignore
      return document.querySelector('div[class*="video-inner"] iframe')
        // @ts-ignore
        ? document.querySelector('div[class*="video-inner"] iframe').src : '';
    });
    const iFrameContent = await context.evaluate(async () => {
      // @ts-ignore
      return document.querySelector('div[class*="video-inner"] iframe')
      // @ts-ignore
        ? document.querySelector('div[class*="video-inner"] iframe').style.height : '';
    });
    if (iFrameContent !== '8px' && iFrameSrc) {
      await context.goto(iFrameSrc);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await context.extract(productDetails);
      // await context.extract('/product/details/stores/n/nocibe/FR/extract', 'APPEND');
      // going back to default page
      await context.goto(url);
    };
    await context.evaluate(async () => {
      // @ts-ignore
      if (window !== undefined) {
        return window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      function addElementToDocument (key, value, src) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.innerText = value;
        catElement.setAttribute('src', src);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const descripNodeList = document.querySelectorAll('div#description p')
        ? document.querySelectorAll('div#description p') : [];
      // @ts-ignore
      const descriptionText = [...descripNodeList].map(e => e.innerText).join(' || ');
      addElementToDocument('descriptionText', descriptionText, '#');

      const shippingNodes = document.querySelectorAll('div[class*="ship"] div[class*="zone-txt"]')
        ? document.querySelectorAll('div[class*="ship"] div[class*="zone-txt"]') : [];
      // @ts-ignore
      const shippingInfo = [...shippingNodes].map(e => e.innerText).join(' || ');
      addElementToDocument('shippingInfo', shippingInfo, '#');
      const altImgSrc = document.querySelectorAll('div[class="prdct__gallery-img "] div[class="prdct__gallery-slide"]:not(:first-child) img')
        ? document.querySelectorAll('div[class="prdct__gallery-img "] div[class="prdct__gallery-slide"]:not(:first-child) img') : [];
      // @ts-ignore
      [...altImgSrc].map(e => addElementToDocument('altImgSrc', '', e.src));
      const manufacturerImgSrc = document.querySelectorAll('div[class*="pyramid-img"] img')
        ? document.querySelectorAll('div[class*="pyramid-img"] img') : [];
      // @ts-ignore
      [...manufacturerImgSrc].map(e => addElementToDocument('manufacturerImgSrc', '', e.src));
      const brandLink = document.querySelector('div[class*="prdct__logo"] a, div[class*="prdct__banner"] a')
        // @ts-ignore
        ? document.querySelector('div[class*="prdct__logo"] a, div[class*="prdct__banner"] a').href : '';
      addElementToDocument('brandLink', '', brandLink);
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.evaluate(async function () {
      const openIngredients = document.querySelector('a[href="#ingredients"]');
      // @ts-ignore
      if (openIngredients) openIngredients.click();
    });
    await context.extract(productDetails, { transform });
  },
};
