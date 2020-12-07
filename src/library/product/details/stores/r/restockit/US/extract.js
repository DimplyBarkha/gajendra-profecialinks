// @ts-nocheck
const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'restockit',
    transform,
    domain: 'restockit.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    try {
      await context.waitForSelector('.magnifier-thumb-wrapper img');
      try {
        await context.evaluate(() => {
          const headers = [];
          const values = [];
          let specs = [];
          const allHeaders = [...document.querySelectorAll('div[class*="product__specs"] div[class*="specs-name"]')];
          const allValues = [...document.querySelectorAll('div[class*="product__specs"] div[class*="specs-value"]')];
          allHeaders.forEach(header => {
            headers.push(header.innerText);
          });
          allValues.forEach(value => {
            values.push(value.innerText);
          });
          for (let i = 0; i < headers.length; i++) {
            specs.push(headers[i] + ' : ' + values[i]);
          }
          specs = specs.join(' | ');
          const target = document.querySelector('.main-content');
          target.setAttribute('specs', specs);
        });
      } catch (e) {
        console.log(e.message);
      }
      try {
        await context.evaluate(() => {
          const videoPresent = document.evaluate(
            '//div[contains(@class,"product__gallery") and contains(@class,"show-print")]//img/@src[contains(.,"video")]',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null,
          );
          const length = videoPresent.snapshotLength;
          console.log('LENGTH: ' + length);
          if (length >= 1) {
            const videoTags = [...document.querySelectorAll('.product__img-bar a[onclick*="video"]')];
            const video = [];
            videoTags.forEach(tag => {
              const t = tag.getAttribute('onclick');
              const x = t.split(',');
              let z = '';
              x.forEach(item => {
                if (item.search('mp4') !== -1) {
                  const y = item.match(/\w+.mp4/g);
                  if (y) {
                    z = y[0];
                  }
                }
              });
              z = 'https://www.restockit.com/videos/product/' + z;
              video.push(z);
            });
            const videos = video.join(' | ');
            const target = document.querySelector('.main-content');
            target.setAttribute('videos', videos);
          }
        });
      } catch (e) {
        console.log(e.message);
      }
      try {
        await context.waitForSelector('#variants-drop-down a');
        await context.evaluate(() => {
          const target = document.querySelector('.main-content');
          // @ts-ignore
          const variants = [...document.querySelectorAll('#variants-drop-down a')];
          let variantsCount = 0;
          if (variants.length > 0) {
            variantsCount = variants.length;
          }
          let allVariants = '';
          variants.forEach(variant => {
            const variantUrl = variant.getAttribute('href');
            let id = variantUrl.split('-');
            id = id[id.length - 1];
            allVariants = allVariants + (allVariants ? ' | ' : '') + id;
          });
          target.setAttribute('variant-count', variantsCount.toString());
          target.setAttribute('variants', allVariants);
          const firstVariant = allVariants.split(' | ')[0];
          target.setAttribute('first-variant', firstVariant);
        });
      } catch (e) {
        await context.evaluate(() => {
          const variantsCount = '0';
          const target = document.querySelector('.main-content');
          target.setAttribute('variant-count', variantsCount);
        });
        console.log(e.message);
      }
    } catch (e) {
      throw new Error('Not a product page');
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
