const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'lyreco',
    transform,
    zipcode: '',
    domain: 'lyreco.com',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const checkExistance = async (selector) => {
      return await context.evaluate(async (selector) => {
        return Boolean(document.querySelector(selector));
      }, selector);
    };

    try {
      await context.waitForSelector('div#productCmsGrid div.item-content>div.picture_grid>a');
    } catch (err) {
      console.log('Search result did not load');
    }
    // checkExistance of Search result of input
    if (await checkExistance('div#productCmsGrid div.item-content>div.picture_grid>a')) {
      try {
        await context.click('div#productCmsGrid div.item-content>div.picture_grid>a');
        await context.waitForSelector('.s7staticimage');
      } catch (err) {
        console.log('Unable to direct to product page');
      }
    }
    // checkExistance of skuSelector
    if (await checkExistance('div[class*="reference_cms"]')) {
      await context.evaluate(() => {
        // @ts-ignore
        const sku = document.querySelector('div[class*="reference_cms"]').innerText.match(/\d+/g).join('');
        document.querySelector('body').setAttribute('sku', sku);
      });
    }
    // checkExistance of variants presence
    if (await checkExistance('div.product-selector--attribute')) {
      await context.evaluate(() => {
        // @ts-ignore
        const variants = [...document.querySelectorAll('div[class="product-selector--attribute"] img')];
        const variantsId = [];
        for (let i = 0; i < variants.length; i++) {
          variantsId.push(variants[i].getAttribute('id').match(/\d+/g).join(''));
        }
        const variantsIds = variantsId.join(' | ');
        const variantsCount = variantsId.length.toString();
        const firstVariant = variantsId[0];
        document.querySelector('body').setAttribute('variants', variantsIds);
        document.querySelector('body').setAttribute('variants-count', variantsCount);
        document.querySelector('body').setAttribute('first-variant', firstVariant);
      });
    }

    // checkExistance of alternate image
    if (await checkExistance('li[class*="jcarousel-item"] div:not([class*="video"])')) {
      await context.evaluate(() => {
      // @ts-ignore
        const alternateImage = [...document.querySelectorAll('div[class*=jcarousel-clip] li div:not([class*=video])')];
        const alternateImagearr = [];
        for (let i = 0; i < alternateImage.length; i++) {
          alternateImagearr.push(alternateImage[i].getAttribute('style').replace(/(.+)url\('(.+wid=)(.+)(&hei=)(.+)/gs, '$21920$41080\n'));
        }
        alternateImagearr.shift();
        const alternateImageCount = alternateImagearr.length.toString();
        const alternateImages = alternateImagearr.join(' | ');
        document.querySelector('body').setAttribute('alternate-image-count', alternateImageCount);
        document.querySelector('body').setAttribute('alternate-images', alternateImages);
      });
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
