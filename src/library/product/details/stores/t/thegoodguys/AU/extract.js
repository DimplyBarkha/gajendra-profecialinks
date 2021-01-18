const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'thegoodguys',
    transform,
    domain: 'thegoodguys.com.au',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const iframeLink = 'iframe[id="eky-dyson-iframe"]';

    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 20000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };

    await optionalWait(iframeLink);

    const isSelectorAvailable = async (iframeLink) => {
      console.log(`Is selector available: ${iframeLink}`);
      return await context.evaluate(function (iframeLink) {
        return !!document.querySelector(iframeLink);
      }, iframeLink);
    };
    const selectorAvailable = await isSelectorAvailable(iframeLink);

    const getSrc = async (iframeLink) => {
      console.log(`Is selector available: ${iframeLink}`);
      return await context.evaluate(function (iframeLink) {
        console.log(document.querySelector(iframeLink).getAttribute('src'));
        return document.querySelector(iframeLink).getAttribute('src');
      }, iframeLink);
    };

    if (selectorAvailable) {
      const getData = await getSrc(iframeLink);
      console.log('IFRAME SOURCE', getData);

      const currentPage = await context.evaluate(function () { return window.location.href; });
      const timeout = 30000;
      await context.goto(getData, { timeout, waitUntil: 'load', checkBlocked: true });
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
      const enhancedContentInfo = await context.evaluate(function () {
        const imageEls = document.querySelectorAll('div.eky-accessory img');
        const text = document.querySelectorAll('div.eky-accessory div');
        const images = [];
        const content = [];
        Array.from(imageEls).forEach(el => {
          // @ts-ignore
          images.push(el.src);
        });

        Array.from(text).forEach(el => {
          content.push(el.textContent);
        });

        return { images, content };
      });

      console.log('Navigating back to product page.');
      await context.goto(currentPage, { timeout, waitUntil: 'load', checkBlocked: true });
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'networkidle0' });

      await context.evaluate(function (content) {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ ' + JSON.stringify(content));
        try {
          let text = '';
          let images = '';
          content.content.forEach(t => {
            text += t ? `${t} ||` : t;
          });
          images = content.images.join(' || ');
          console.log('Adding content to body');
          const body = document.querySelector('body');
          body.setAttribute('images', images);
          const element = document.querySelector('div');
          element.setAttribute('text', text);
        } catch (error) {
          console.log(`error while appending the data ${JSON.stringify(error)}`);
        }
      }, enhancedContentInfo);
    }
    await context.extract(productDetails, { transform: transformParam });
  },
};
