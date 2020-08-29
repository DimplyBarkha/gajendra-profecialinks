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
    // await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    // await context.waitForSelector('div[class^="slick-slide"]');

    // const videosTiles = await context.evaluate(async function () {
    //   const dataIndex = [];
    //   if (document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]').length) {
    //     [...document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]')].forEach((element) => {
    //       if (element.parentNode && element.parentNode.parentNode && element.parentNode.parentNode.parentNode && element.parentNode.parentNode.parentNode.getAttribute('data-index')) {
    //         dataIndex.push(element.parentNode.parentNode.parentNode.getAttribute('data-index'));
    //       }
    //     });
    //     return dataIndex;
    //   }
    //   console.log(document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]'));
    //   return document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]').length;
    // });

    // const tiles = await context.evaluate(async function () {
    //   return document.querySelectorAll('div[class^="slick-slide"]').length;
    // });

    // await new Promise((resolve, reject) => setTimeout(resolve, 10000));

    // console.log('vide');
    // console.log(videosTiles);
    // console.log(tiles);

    // async function grabVideoLinks (videosTiles) {
    //   if (videosTiles) {
    //     const videos = [];
    //     for (let i = 0; i < videosTiles.length; i++) {
    //       await context.click('div[class^="slick-slide"][data-index="' + videosTiles[i] + '"] div[data-test="mms-video-thumbnail"]');
    //       await context.waitForSelector('div#playButton > div');
    //       await context.click('div#playButton > div');
    //       await context.evaluate(async function () {
    //         document.querySelector('div#playButton > div').click();
    //       });
    //       await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    //       const vid = await context.evaluate(async function () {
    //         function getEleByXpath (xpath) {
    //           const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //           console.log('Element' + element);
    //           const text = element ? element.textContent : null;
    //           return text;
    //         }
    //         const vidLink = getEleByXpath('//video/@src');
    //         console.log(vidLink);
    //         return vidLink;
    //       });
    //       videos.push(vid);
    //     }
    //     return videos;
    //   }
    // }

    // console.log('vide');
    // console.log(videosTiles);

    // const vid = await grabVideoLinks(videosTiles);

    // const addHiddenVidDiv = await context.evaluate(async function (id, content) {
    //   const newDiv = document.createElement('div');
    //   newDiv.id = id;
    //   newDiv.textContent = content;
    //   newDiv.style.display = 'none';
    //   document.body.appendChild(newDiv);
    // }, 'ii_videos', vid.join(' || '));

    // addHiddenVidDiv;

    // console.log(addHiddenVidDiv);

    const manufButton = await context.evaluate(async function () {
      return !!document.querySelector('div[class^="RichProductDescription"] button');
    });

    if (manufButton) {
      await context.click('div[class^="RichProductDescription"] button');
      await context.waitForSelector('iframe#loadbeeTabContent');
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));
      // await context.waitForSelector('iframe#loadbeeTabContent');
    }

    await context.evaluate(async function () {
      const makeApiCall = async (url, options) => {
        try {
          console.log(`Making API call to => ${url}`);
          if (!options) {
            options = {
              mode: 'no-cors',
              credentials: 'same-origin',
              headers: { 'Content-Type': 'application/json' },
            };

            return await (await fetch(url, options)).json();
          }

          return await (await fetch(url, options)).text();
        } catch (err) {
          console.log('Error while making API call.', err);
        }
      };

      // const url = 'https://service.loadbee.com/ean/5025155028155/de_DE?css=default&template=default&button=default#[!opt!]{"type":"json"}[/!opt!]';

      // await fetch(url, {
      //   headers: {
      //     // "accept": "*/*",
      //     // "accept-language": "en-US,en;q=0.9",
      //     // "sec-fetch-dest": "empty",
      //     'sec-fetch-mode': 'cors',
      //     // 'set-mode': 'cors',
      //     // "sec-fetch-site": "same-origin",
      //     // "x-requested-with": "XMLHttpRequest"
      //   },
      //   // "referrer": refURL,
      //   // "referrerPolicy": "no-referrer-when-downgrade",
      //   body: null,
      //   method: 'GET',
      //   mode: 'cors',
      // }).then(response => {
      //   console.log(response);
      //   return response.text();
      // })
      //   .then(result => {
      //     console.log('result');
      //     console.log(result.length);
      //     console.log(result);
      //   })
      //   .catch(error => console.log('error', error));
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };
      
      fetch("https://service.loadbee.com/ean/5025155028155/de_DE?css=default&template=default&button=default", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
      console.log('whoawhoa');
      // let aplusResponse = await makeApiCall('https://service.loadbee.com/ean/5025155038390/de_DE?css=default&template=mediamarkt&button=default&data=%7B%22shop%22%3A%22www.mediamarkt.de%22%2C%22source%22%3A%22inpage%22%2C%22api%22%3A%22n8EupZUeGxWPnfPk3bLkHwdVywL48DEw%22%7D#[!opt!]{"type":"json"}[/!opt!]', {});
      // console.log(aplusResponse);

      // console.log(document.querySelector('iframe#loadbeeTabContent').contentWindow.document.innerHTML);
      // console.log(document.querySelector('iframe#loadbeeTabContent').contentWindow.document);
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

    // await context.click('section#description div[class^="RichProductDescription"] button');
    // await context.waitForSelector('iframe#loadbeeTabContent');
    // console.log(document.querySelector('iframe#loadbeeTabContent').contentWindow.document);

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
