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
    const manufDescButton = await context.evaluate(async function () {
      return !!document.querySelector('div[class^="RichProductDescription"] button');
    });

    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    async function addHiddenInfo (elementID, content) {
      await context.evaluate(async function (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.id = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }, elementID, content);
    }

    if (manufDescButton) {
      let content = null;
      let image = null;
      await context.click('div[class^="RichProductDescription"] button');
      await context.waitForSelector('iframe#loadbeeTabContent');
      const iframeURLLink = await context.evaluate(async function () {
        return document.querySelector('iframe#loadbeeTabContent').getAttribute('src');
      });
      await context.goto(iframeURLLink);

      const text = await context.evaluate(async function () {
        return document.querySelector('body').innerText;
      });
      content = text;
      const images = await context.evaluate(async function () {
        const images = document.querySelectorAll('body img');
        const imagesSrc = [];
        [...images].forEach((element) => {
          if (element.getAttribute('data-src')) {
            imagesSrc.push(element.getAttribute('data-src'));
          }
        });
        return imagesSrc.join(' || ');
      });
      image = images;
      await context.goto(link);
      addHiddenInfo('manufContent', content);
      addHiddenInfo('manufImg', image);
    }

    await context.waitForSelector('div[class^="slick-slide"]'. { timeout:45000 });
    try {
      await context.waitForSelector('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]'. { timeout:45000 });
    } catch (error) {
      console.log('No videos')
    }

    const videosTiles = await context.evaluate(async function () {
      const dataIndex = [];
      if (document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]').length) {
        [...document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]')].forEach((element) => {
          if (element.parentNode && element.parentNode.parentNode && element.parentNode.parentNode.parentNode && element.parentNode.parentNode.parentNode.getAttribute('data-index')) {
            dataIndex.push(element.parentNode.parentNode.parentNode.getAttribute('data-index'));
          }
        });
        return dataIndex;
      }
      console.log(document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]'));
      return document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]').length;
    });

    const tiles = await context.evaluate(async function () {
      return document.querySelectorAll('div[class^="slick-slide"]').length;
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 10000));

    console.log('vide');
    console.log(videosTiles);
    console.log(tiles);

    async function grabVideoLinks (videosTiles) {
      if (videosTiles) {
        const videos = [];
        for (let i = 0; i < videosTiles.length; i++) {
          await context.click('div[class^="slick-slide"][data-index="' + videosTiles[i] + '"] div[data-test="mms-video-thumbnail"]');
          await context.waitForSelector('div#playButton > div');
          // await context.waitForSelector('div[class^="slick-slide slick-active slick-current"][data-index="' + videosTiles[i] + '"]');
          await context.click('div#playButton > div');
          await context.evaluate(async function () {
            document.querySelector('div#playButton > div').click();
          });
          await new Promise((resolve, reject) => setTimeout(resolve, 10000));
          const vid = await context.evaluate(async function () {
            function getEleByXpath (xpath) {
              const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              console.log('Element' + element);
              const text = element ? element.textContent : null;
              return text;
            }
            const vidLink = getEleByXpath('//video/@src');
            console.log(vidLink);
            return vidLink;
          });
          videos.push(vid);
        }
        return videos;
      }
    }

    console.log('vide');
    console.log(videosTiles);

    const vid = await grabVideoLinks(videosTiles);

    const addHiddenVidDiv = await context.evaluate(async function (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }, 'ii_videos', vid.join(' || '));

    // addHiddenVidDiv;

    console.log(addHiddenVidDiv);


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

      let productID = getEleByXpath('(//span[contains(@class, "DetailsHeader__")]//span)[1]');
      productID = productID.replace('| Art.-Nr. ', '').replace(' | ', '').trim();
      const graphQLCall = `GraphqlProduct:${productID}`;
      console.log(window.__PRELOADED_STATE__);
      console.log(window.__PRELOADED_STATE__.apolloState);
      console.log(graphQLCall);
      console.log(window.__PRELOADED_STATE__.apolloState[graphQLCall]);
      if (window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.apolloState && window.__PRELOADED_STATE__.apolloState[graphQLCall] && window.__PRELOADED_STATE__.apolloState[graphQLCall].ean) {
        console.log(window.__PRELOADED_STATE__.apolloState[graphQLCall]);
        const ean = window.__PRELOADED_STATE__.apolloState[graphQLCall].ean;
        console.log(ean);
        addHiddenDiv('ii_ean', ean);
      }
    });
    await context.extract(productDetails, { transform });
  },
};
