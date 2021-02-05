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
      // const enhancedContentInfo = await context.evaluate(function () {
      //   const imageEls = document.querySelectorAll('div.eky-accessory img');
      //   const text = document.querySelectorAll('div.eky-accessory div');
      //   const images = [];
      //   const content = [];
      //   Array.from(imageEls).forEach(el => {
      //     // @ts-ignore
      //     images.push(el.src);
      //   });

      //   Array.from(text).forEach(el => {
      //     content.push(el.textContent);
      //   });

      //   return { images, content };
      // });
      const inTheBoxUrl = await context.evaluate(async function () {
        const imgArray = document.querySelectorAll('div.eky-relative-wrapper div.eky-header-video-container video, div.eky-accessory img');
        const inTheBoxUrlArray = [];
        imgArray.forEach(img => {
          // @ts-ignore
          if (img.src) {
            // @ts-ignore
            inTheBoxUrlArray.push(img.src);
          }
        })

        const textArray = document.querySelectorAll('div#customize-iw h1.eky-smaller, div.eky-accesory-title');
        const inTheBoxText = [];
        textArray.forEach(txt => {
          // @ts-ignore
          if (txt.innerText) {
            // @ts-ignore
            inTheBoxText.push(txt.innerText);
          }
        });
        console.log('inTheBox code execution complete');

        return { inTheBoxUrlArray, inTheBoxText };
      });

      console.log('Navigating back to product page.');
      await context.goto(currentPage, { timeout, waitUntil: 'load', checkBlocked: true });
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'networkidle0' });

      await context.evaluate(async function (inTheBoxUrl) {
        // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ ' + JSON.stringify(content));
        // try {
        //   let text = '';
        //   let images = '';
        //   content.content.forEach(t => {
        //     text += t ? `${t} ||` : t;
        //   });
        //   images = content.images.join(' || ');
        //   console.log('Adding content to body');
        //   const body = document.querySelector('body');
        //   body.setAttribute('images', images);
        //   const element = document.querySelector('div');
        //   element.setAttribute('text', text);
        // } catch (error) {
        //   console.log(`error while appending the data ${JSON.stringify(error)}`);
        // }

        function addHiddenDiv(id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }

        // @ts-ignore

        const inTheBoxText = inTheBoxUrl.inTheBoxText.join(' || ');
        addHiddenDiv('added_inTheBoxText', inTheBoxText);


        const inTheboxUrls = inTheBoxUrl.inTheBoxUrlArray.join(' || ');
        addHiddenDiv('added_inTheBoxUrl', inTheboxUrls);

    }, inTheBoxUrl);
  }
    await context.extract(productDetails, { transform: transformParam });
},
};
