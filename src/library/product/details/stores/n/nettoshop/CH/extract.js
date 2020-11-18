
const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'nettoshop',
    transform: transform,
    domain: 'nettoshop.ch',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    // const cssProduct = 'div.c-product-detail ember-view';
    const cssProductDetails = 'div.ivy-tabs-tablist a.ivy-tabs-tab';
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    await applyScroll(context);
    console.log('.....waiting......');
    await context.waitForSelector(cssProductDetails, { timeout: 5000 });


    const productAvailable = await isSelectorAvailable(cssProductDetails);
    console.log(`productAvailable: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product detail button');
      await context.click(cssProductDetails);
      await context.waitForNavigation({ timeout: 5000, waitUntil: 'load' });
      console.log('navigation complete!!');
    }

    // specs click
    const specSelector = 'div.ivy-tabs-tablist a.ivy-tabs-tab';

    console.log('.....waiting......');
    await context.waitForSelector(specSelector, { timeout: 5000 });

    const specAvailable = await isSelectorAvailable(specSelector);
    console.log(`specAvailable: ${specAvailable}`);
    if (specAvailable) {
      console.log('clicking spec detail button');
      await context.click(specSelector);
      await context.waitForNavigation({ timeout: 5000, waitUntil: 'load' });
      console.log('navigation complete!!');
    }
    // specs end

    // video click
    let videoList = [];
    const videoSelectorButton = '*[data-component*="c-youtube-embed"]';;

    console.log('.....waiting for video.....');
    let videoAvailable;
    try {
      await context.waitForSelector(videoSelectorButton, { timeout: 20000 });
      videoAvailable = await isSelectorAvailable(videoSelectorButton);
      console.log('.....waiting....complete..video..');
    } catch (e) {
    }

    console.log(`videoAvailable: ${videoAvailable}`);
    if (videoAvailable) {
      console.log('clicking video button');
      await context.click(videoSelectorButton);
      //await context.waitForNavigation({ timeout: 5000, waitUntil: 'load' });
      await new Promise(resolve => setTimeout(resolve, 5000));
      await context.waitForSelector('*[class*="c-tabs__video-item"] iframe', { timeout: 5000 });
      console.log('navigation complete!!');
      videoList = await context.evaluate(async function() {
          const videoSelector = 'div.c-youtube-embed iframe';
          const allVideoNodes = document.querySelectorAll(videoSelector);
          let videoList = [];
          allVideoNodes.forEach(q => {
            if(q.hasAttribute('src')) {
              videoList.push(q.getAttribute('src'));
            }
          });
          return videoList;
      })
    }

    // video end
    // product tour click
    // const tourSelector = 'div[class="c-product-tour__item-head"] button';

    // console.log('.....waiting for tour....');
    // let tourAvailable;
    // try {
    //   await context.waitForSelector(tourSelector, { timeout: 15000 });
    //   tourAvailable = await isSelectorAvailable(tourSelector);
    //   console.log('.....waiting......complete tour');
    // } catch (e) {
    // }
    // console.log(`tourAvailable: ${tourAvailable}`);
    // if (tourAvailable) {
    //   try {
    //     console.log('clicking tour button');

    //     await context.focus(tourSelector);
    //     console.log('focus complete!!');
    //     await context.click(tourSelector);
    //     console.log('click complete!!');
    //     await context.waitForNavigation({ timeout: 15000, waitUntil: 'load' });
    //     console.log('navigation complete!!');
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    // product tour end

    const tourButtonSelector = '*[id*="tour-tab-title"]';
    const tourSelector = '*[aria-labelledby*="tour-tab-title"]';
    try {
      await context.waitForSelector(tourButtonSelector, { timeout: 20000 });
    } catch(e) {
      console.log("tourButtonSelector is not found");
    }
    const tourButtonAvailable = await isSelectorAvailable(tourButtonSelector);
    if (tourButtonAvailable) {
      // document.querySelector(tourSelector).click();
      await context.click(tourButtonSelector);
      try {
        await context.waitForSelector(tourSelector, { timeout: 10000 });
      } catch(er) {
        console.log("tourSelector is not found")
      }
      const tourContentAvailable = await isSelectorAvailable(tourSelector);
      await new Promise(resolve => setTimeout(resolve, 2000));
      //await context.waitForSelector('#inpage_container img', { timeout: 5000 });
      if (tourContentAvailable) console.log('Product tour content available');
      console.log('.....waiting....complete..for product tour content..');

    }

    await context.evaluate(async function (videoList) {

      // function to append the elements to DOM
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      if (document.querySelector('*[id*="inpage_container"]')) {
        //for manufacturerImages
        let xpath1 = '//div[@id="inpage_container"]//img/@src';
        let imgList = [];
        let imgSelector = document.evaluate(xpath1, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let index = 0; index < imgSelector.snapshotLength; index++) {
          let element = imgSelector.snapshotItem(index);
          let imgURL = element.nodeValue;
          imgList.push(imgURL);
        }
        for (let i = 0; i < imgList.length; i++) {
          addElementToDocument('manufactureImages', imgList[i]);
        }
        // getting video from enhancedContent section
        const videoSelector = '[title*=Flix-media-video]';
        const videoSelectorNode = document.querySelector(videoSelector);
        if(videoSelectorNode && videoSelectorNode.hasAttribute('src')) {
          addElementToDocument('productVideos',videoSelectorNode.getAttribute('src'));
        }

        //for manufacturerDescription
        let xpath2 = '//div[@id="inpage_container"]//div[contains(@class,"flix-Text-block" ) or contains(@class,"inpage_ftgridtext")]//div/text()';
        let descList = [];
        let descSelector = document.evaluate(xpath2, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let index = 0; index < descSelector.snapshotLength; index++) {
          let element = descSelector.snapshotItem(index);
          let desc = element.nodeValue;
          descList.push(desc);
        }
        addElementToDocument('manufactureDescription', descList.join(" "));
      }
      if (videoList.length > 0) {
        for (let i = 0; i < videoList.length; i++) {
          addElementToDocument('productVideos', videoList[i]);
        }
      }

    }, videoList);

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};

