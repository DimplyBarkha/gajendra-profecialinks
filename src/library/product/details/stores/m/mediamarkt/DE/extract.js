const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    // const selectorAvailable = async (cssSelector) => {
    //   console.log(`Is selector available: ${cssSelector}`);
    //   return await context.evaluate(function (selector) {
    //     return !!document.querySelector(selector);
    //   }, cssSelector);
    // };

    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForSelector('div[class^="slick-slide"]');

    const videosTiles = await context.evaluate(async function () {
      console.log('hiiiii');
      console.log(document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]'));
      return document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]').length;
      // ? document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]') : null;
    });

    const tiles = await context.evaluate(async function () {
      // console.log('hiiiii');
      // console.log(document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]'))
      return document.querySelectorAll('div[class^="slick-slide"]').length;
      // ? document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]') : null;
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 10000));

    console.log('vide');
    console.log(videosTiles);
    console.log(tiles);

    if (videosTiles) {
      const videos = [];
      for (let i = 0; i < tiles.length; i++) {
        // document.querySelectorAll('div[class^="slick-slide"][data-index="2"] div[data-test="mms-video-thumbnail"]')

        await context.click('div[class^="slick-slide"][data-index="' + i + '"] div[data-test="mms-video-thumbnail"]');
        await context.waitForSelector('div#playButton > div');
        await context.click('div#playButton > div');
        await new Promise((resolve, reject) => setTimeout(resolve, 10000));
        const vid = await context.evaluate(async function () {
          // const videos = [];
          function getEleByXpath (xpath) {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            console.log('Element' + element);
            const text = element ? element.textContent : null;
            return text;
          }
          const vidLink = getEleByXpath('//video/@src');
          console.log(vidLink);
          // videos.push(vidLink);
          return vidLink;
        });
        videos.push(vid);
      }
      console.log(videos);
      // [...videosTiles].forEach(async function (element) {
      //   await new Promise((resolve, reject) => setTimeout(resolve, 55000));
      //   console.log(element);
      // });
    }

    await context.evaluate(async function () {
      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      // if (document.querySelector('gdpr-cookie-layer--show') && document.querySelector('button.gdpr-cookie-layer__btn--submit')) {
      //   document.querySelector('button.gdpr-cookie-layer__btn--submit').click();
      // }

      // if (document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]').length) {
      //   const videosTiles = document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]');
      //   const videos = [];

      //   console.log('hello!');
      //   console.log(videosTiles);

      //   const clickOnElements = async function (selector) {
      //     function timeout (ms) {
      //       return new Promise((resolve) => setTimeout(resolve, ms));
      //     }
      //     let nextButton = selector;
      //     if (typeof selector === 'string') {
      //       nextButton = document.querySelector(selector);
      //     }
      //     console.log(nextButton);
      //     if (nextButton) {
      //       nextButton.click();
      //       await timeout(20000);
      //     }
      //   };
      //   [...videosTiles].forEach(async function (element) {
      //     // await new Promise((resolve, reject) => setTimeout(resolve, 55000));
      //     // await clickOnElements(element);
      //     // // element.click();
      //     // // await clickOnElements(element);

      //     // // function timeout (ms) {
      //     // //   return new Promise((resolve) => setTimeout(resolve, ms));
      //     // // }
      //     // // if (element) {
      //     // //   element.click();
      //     // //   await timeout(10000);
      //     // // }
      //     // // await new Promise((resolve, reject) => setTimeout(resolve, 8000));
      //     // // const playButton = document.querySelector('div#playButton > div');
      //     // // if (playButton) {
      //     // //   playButton.click();
      //     // //   await timeout(10000);
      //     // // }
      //     // console.log('a')
      //     // await clickOnElements('div#playButton > div');
      //     // console.log('b')
      //     // setTimeout(() => {
      //     // document.querySelector('div#playButton > div').click();

      //     const vidLink = getEleByXpath('//video/@src');
      //     videos.push(vidLink);
      //     // }, 8000);
      //     await new Promise((resolve, reject) => setTimeout(resolve, 8000));
      //     // console.log(element)
      //     // element.click();
      //     // setTimeout(() => {
      //     //   console.log('testing');
      //     // }, 30000);
      //     // document.querySelector(".overlay-bg").click();
      //   });
      //   addHiddenDiv('ii_videos', videos.join(' || '));
      // }

      let productID = getEleByXpath('(//span[contains(@class, "DetailsHeader__")]//span)[1]');
      productID = productID.replace('|  Item No.  ', '').replace(' | ', '');
      const graphQLCall = `GraphqlProduct:${productID}`;
      if (window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.apolloState && window.__PRELOADED_STATE__.apolloState[graphQLCall]) {
        console.log(window.__PRELOADED_STATE__.apolloState[graphQLCall]);
      }
    });

    // const modal = await selectorAvailable('gdpr-cookie-layer--show');
    // console.log('midal!')
    // if (modal) {
    //   console.log('midal!')
    //   const modalCloseButton = await selectorAvailable('button.gdpr-cookie-layer__btn--submit');
    //   if (modalCloseButton) {
    //     await context.click('button.gdpr-cookie-layer__btn--submit');
    //   }
    // }
    await context.extract(productDetails, { transform });
  },
};
// window.__PRELOADED_STATE__.apolloState['GraphqlProduct:2169596']
