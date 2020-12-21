// @ts-nocheck
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
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails, Helpers, SharedHelpers }) => {
    const sharedhelpers = new SharedHelpers(context);

    const popUpsButton = await context.evaluate(async function () {
      return !!document.querySelector('button#privacy-layer-accept-all-button');
    });

    const popUps = async function () {
      await context.evaluate(async function () {
        if (document.querySelector('button#privacy-layer-accept-all-button')) {
          document.querySelector('button#privacy-layer-accept-all-button').click();
        }
      });
    };

    try {
      await context.waitForSelector('button#privacy-layer-accept-all-button', { timout: 35000 });
    } catch (error) {
      console.log('No pop-ups!');
    }

    if (popUpsButton) {
      await context.click('button#privacy-layer-accept-all-button');
    }

    popUps();

    try {
      await context.evaluate(async () => {
        // document.querySelector('section#description').scrollIntoView({ behavior: 'smooth' });
        // const desc = Boolean(document.querySelector('div[class*="FallbackDescription"]'));
        // if (desc) {
        //   document.querySelector('div[class*="FallbackDescription"]').scrollIntoView({ behavior: 'smooth' });
        // }
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
      await context.waitForSelector('div[class^="RichProductDescription"] button', { timeout: 45000 });
    } catch (error) {
      console.log('Not loading manufacturer button');
    }

    const manufDescButton = await context.evaluate(async function () {
      return !!document.querySelector('div[class^="RichProductDescription"] button');
    });

    console.log('manufDescButton');
    console.log(manufDescButton);

    const expandDetailsButton = await context.evaluate(async function () {
      return !!document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]');
    });

    if (expandDetailsButton) {
      await context.click('div[class^="ProductFeatures"] a[class*="ExpandLink"]');

      await context.evaluate(async function () {
        if (document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]') && !(document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]').textContent.includes('Details ausblenden'))) {
          document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]').click();
        }
      });
    }

    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    if (manufDescButton) {
      let content = null;
      let image = null;
      let inBoxText = null;
      let inBoxUrls = null;
      let comparisionText = null;
      await context.click('div[class^="RichProductDescription"] button');
      // await context.evaluate(async function () {
      //   document.querySelector('div[class^="RichProductDescription"] button').click();
      // });

      try {
        await context.waitForSelector('iframe[id^="loadbee"]', { timeout: 55000 });
        const iframeURLLink = await context.evaluate(async function () {
          return document.querySelector('iframe[id^="loadbee"]').getAttribute('src');
        });
        const obj = await sharedhelpers.goToiFrameLink(iframeURLLink, link, 'body img', 'src', null, null, '.in-the-box', '.compare-headline');
        image = obj.image;
        content = obj.content;
        inBoxText = obj.inBoxText;
        inBoxUrls = obj.inBoxUrls;
        comparisionText = obj.comparisionText;

        if (inBoxUrls.length) {
          sharedhelpers.addHiddenInfo('ii_inBoxUrls', '', inBoxUrls);
        }
        if (inBoxText.length) {
          sharedhelpers.addHiddenInfo('ii_inBoxText', '', inBoxText);
        }
        sharedhelpers.addHiddenInfo('ii_comparisionText', comparisionText);

        await sharedhelpers.addHiddenInfo('manufContent', content);
        await sharedhelpers.addHiddenInfo('manufImg', image.join(' || '));
      } catch (err) {
        try {
          await context.click('div[class^="RichProductDescription"] button');
          const delay = t => new Promise(resolve => setTimeout(resolve, t));
          await delay(2000);
          await context.waitForSelector('#inpage_container', { timeout: 30000 });
          await context.waitForSelector('.flix-feature-image img', { timeout: 30000 });
          await context.evaluate(() => {
            const imgs = [...document.querySelectorAll('.flix-feature-image img')];
            const images = [];
            imgs.forEach(img => {
              const src = img.dataset.srcset;
              const value = src.includes('https:') ? src : 'https:' + src;
              images.push(value);
            });
            const manuImages = images.join(' || ');
            const div = document.createElement('div');
            div.id = 'manufImg';
            div.innerText = manuImages;
            document.body.append(div);
          });
          await context.evaluate(() => {
            const desc = document.evaluate(
              '//div[@class="flix-std-title"] | //div[contains(@class,"showlesscontent")]/text() | //div[contains(@class,"showlesscontent")]//span[@class="flix-sec"]',
              document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            const des = [];
            for (let i = 0; i < desc.snapshotLength; i++) {
              des.push(desc.snapshotItem(i).textContent);
            }
            const manuContent = des.join('');
            const div = document.createElement('div');
            div.id = 'manufContent';
            div.innerText = manuContent;
            document.body.append(div);
          });
        } catch (e) {
          console.log('Looks like the website may not have manufacturer content');
        }
      }
    }

    await sharedhelpers.addHiddenInfo('ii_producturl', link);

    const productID = await sharedhelpers.getEleByXpath('(//span[contains(@class, "DetailsHeader__")]//span)[1]');

    async function graphQLCallObj (productID) {
      const obj = await context.evaluate(async function (productID) {
        // function addHiddenDiv (id, content) {
        //   const newDiv = document.createElement('div');
        //   newDiv.id = id;
        //   newDiv.textContent = content;
        //   newDiv.style.display = 'none';
        //   document.body.appendChild(newDiv);
        // }

        // async function getData (url) {
        //   let data = {};

        //   const response = await fetch(url, {
        //     accept: 'application/json, text/plain, */*',
        //     referrer: window.location.href,
        //     referrerPolicy: 'no-referrer-when-downgrade',
        //     body: null,
        //     method: 'GET',
        //     mode: 'cors',
        //   });

        //   if (response && response.status === 404) {
        //     console.log('Product Not Found!!!!');
        //     return data;
        //   }

        //   if (response && response.status === 200) {
        //     console.log('Product Found!!!!');
        //     data = await response.json();
        //     return data;
        //   }
        // };

        console.log(productID);

        const productIDText = productID.replace('| Art.-Nr. ', '').replace(' | ', '').trim();
        const graphQLCall = `GraphqlProduct:${productIDText}`;
        console.log(graphQLCall);
        // eslint-disable-next-line prefer-const
        // let videos = [];
        let ean = null;
        if (window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.apolloState && window.__PRELOADED_STATE__.apolloState[graphQLCall]) {
          console.log(window.__PRELOADED_STATE__.apolloState[graphQLCall]);
          if (window.__PRELOADED_STATE__.apolloState[graphQLCall].ean) {
            ean = window.__PRELOADED_STATE__.apolloState[graphQLCall].ean;
          }
          // if (window.__PRELOADED_STATE__.apolloState[graphQLCall].assets) {
          //   const totalAssets = window.__PRELOADED_STATE__.apolloState[graphQLCall].assets;
          //   totalAssets.forEach(async function (element) {
          //     if (window.__PRELOADED_STATE__.apolloState[element.id].usageType === 'Video') {
          //       const url = window.__PRELOADED_STATE__.apolloState[element.id].link;
          //       const result = await getData(url);
          //       console.log(result);
          //       if (result !== null && Object.keys(result).length) {
          //         console.log(result);
          //         result.forEach((element) => {
          //           console.log(element);
          //           const videosResults = element.videos !== null ? element.videos : [];
          //           console.log(videosResults);
          //           videosResults.forEach(async function (video) {
          //             console.log(video);
          //             const videoText = video.links[0].location;
          //             videos.push(videoText.replace('/thumb/', '/vm/'));
          //           });
          //         });
          //       }
          //       addHiddenDiv('ii_videos', videos.join(' || '));
          //     }
          //   });
          // }
        }
        // console.log('{ videos: videos, ean: ean }');
        // console.log({ videos: videos, ean: ean });
        // return { videos: videos, ean: ean };
        return { ean: ean };
      }, productID);
      return obj;
    }
    const graphQLObj = await graphQLCallObj(productID);

    if (graphQLObj !== null) {
      await sharedhelpers.addHiddenInfo('ii_ean', graphQLObj.ean);
      // await sharedhelpers.addHiddenInfo('ii_videos1', graphQLObj.videos.join(' || '));
    }

    // For alternate images
    try {
      await context.click('div[data-test="mms-th-gallery"] div[direction="next"]');
      const delay = t => new Promise(resolve => setTimeout(resolve, t));
      await delay(2000);
    } catch (e) {
      console.log(e.message);
    }

    // For additional description
    try {
      await context.evaluate(() => {
        const desc = document.evaluate(
          '//section[@id="description"]//div[@data-test="mms-info-teaser-regular"]/* | //div[contains(@class,"FallbackDescription")]/*',
          document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null,
        );
        let text = '';
        for (let i = 0; i < desc.snapshotLength; i++) {
          const item = desc.snapshotItem(i);
          let t = '';
          if (item.querySelector('a')) {
            item.textContent = '';
          }
          if (item.nodeName === 'UL') {
            const lis = [...item.querySelectorAll('li')];
            lis.forEach(li => {
              t = t + (t ? ' || ' : '') + li.innerText;
            });
            item.textContent = ' || ' + t + ' | ';
          }
          text = text + (text ? ' ' : '') + item.textContent;
        }
        text = text.replace(/(\|\s?)$/, '');
        if (text === '' || text === null) {
          text = document.querySelector('div[class*="FallbackDescription"]').innerText;
        }
        const div = document.createElement('div');
        div.id = 'additional-description';
        div.innerText = text;
        document.body.append(div);
      });
    } catch (e) {
      console.log(e.message);
    }

    // For videos
    try {
      await context.evaluate(async () => {
        const delay = t => new Promise(resolve => setTimeout(resolve, t));
        async function clickImages (image) {
          const videos = Array.from(document.querySelectorAll(image));
          try {
            for (const video of videos) {
              console.log('Clicking on video thumbnail');
              video.click();
              await delay(2000);
            }
          } catch (err) {
            console.log('Video Loading issues');
          }
        }
        await clickImages('div[data-test="mms-video-thumbnail"] img');
      });
      const delay = t => new Promise(resolve => setTimeout(resolve, t));
      await delay(2000);
      await context.waitForNavigation({ timeout: 15000, waitUntil: 'networkidle0' });
      await context.evaluate(async () => {
        const delay = t => new Promise(resolve => setTimeout(resolve, t));
        async function clickPlayButtons (btn) {
          const videos = Array.from(document.querySelectorAll(btn));
          try {
            for (const video of videos) {
              console.log('Clicking on play button');
              video.click();
              await delay(2000);
            }
          } catch (err) {
            console.log('Video Loading issues');
          }
        }
        await clickPlayButtons('.cliplister-viewer #playButton > div');
      });
      await context.evaluate(() => {
        const vids = [...document.querySelectorAll('.cliplister-viewer video')];
        const videos = [];
        vids.forEach(vid => {
          const item = vid.getAttribute('src');
          videos.push(item);
        });
        const video = videos.join(' | ');
        const div = document.createElement('div');
        div.id = 'videos-url';
        div.innerText = video;
        document.body.append(div);
      });
    } catch (e) {
      console.log(e.message);
    }

    // For unInterruptedPDP
    await context.evaluate(async () => {
      const scrollDiv = document.querySelector('#accessories');
      if (scrollDiv) {
        scrollDiv.scrollIntoView({ behavior: 'smooth' });
        const delay = t => new Promise(resolve => setTimeout(resolve, t));
        await delay(2000);
      }
    });

    await context.extract(productDetails, { transform });
  },
};
