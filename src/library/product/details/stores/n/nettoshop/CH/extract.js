
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
        function stall (ms) {
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
    const videoSelector = 'div[data-accordion="c-youtube-embed"] button';

    console.log('.....waiting for video.....');
    let videoAvailable;
    try {
      await context.waitForSelector(videoSelector, { timeout: 5000 });
      videoAvailable = await isSelectorAvailable(videoSelector);
      console.log('.....waiting....complete..video..');
    } catch (e) {
    }

    console.log(`videoAvailable: ${videoAvailable}`);
    if (videoAvailable) {
      console.log('clicking video button');
      await context.click(videoSelector);
      await context.waitForNavigation({ timeout: 5000, waitUntil: 'load' });
      console.log('navigation complete!!');
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
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
