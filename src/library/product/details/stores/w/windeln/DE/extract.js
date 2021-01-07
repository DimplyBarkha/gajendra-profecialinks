const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  async function extractionHelper () {
    await context.evaluate(async () => {
      const images = document.querySelectorAll('.slick-track>div>img');
      let imageUrl;
      const categorySelector = document.querySelectorAll('.row.breadcrumbs-section>ol>li');
      let category;

      let ratingPresentSelector = document.querySelector('span[itemprop="ratingValue"]');
      let ratingAbsentSelector = document.querySelector('.ratings-list-no-ratings');

      if (ratingAbsentSelector !== null) {
        ratingAbsentSelector = 'Noch keine Bewertungen.';

        document.querySelector('.selection-separation-line').setAttribute('rating', ratingAbsentSelector);
      }

      if (ratingPresentSelector !== null) {
        ratingPresentSelector = ratingPresentSelector.textContent.replace('.', ',');

        document.querySelector('.selection-separation-line').setAttribute('rating', ratingPresentSelector);
      }

      for (let o = 1; o < categorySelector.length; o++) {
        if (categorySelector[o] !== null && categorySelector[o] !== undefined) {
          category = categorySelector[o].textContent;
          category = category.replace('Zurück zu:', '');

          if (categorySelector[o + 1] !== undefined) {
            document.querySelectorAll('.row.breadcrumbs-section>ol>li')[o].setAttribute('category', category);
          }
        }
      }

      let p = 0;

      for (let r = 0; r < images.length; r++) {
        imageUrl = images[r].src;

        if (imageUrl.includes('youtube.com')) {
          const urlProp = imageUrl.replace('.jpg', '');

          document.querySelectorAll('.media-wrapper.video-wrapper')[p].setAttribute('videoUrl', urlProp);
          p++;
        };
      };
    });
  }

  const pV3Length = await context.evaluate(() => {
    return document.querySelectorAll('.product-variant-2>div>div').length;
  });

  const pV1 = await context.evaluate(() => {
    return document.querySelectorAll('.product-variant-1>li');
  });

  const pV3 = await context.evaluate(() => {
    return document.querySelectorAll('.product-variant-2>div>div');
  });
  const pV1Length = await context.evaluate(() => {
    return document.querySelectorAll('.product-variant-1>li').length;
  });

  if (pV1Length > 1) {
    for (let i = 0; i < pV1Length; i++) {
      const pV2Length = await context.evaluate(() => {
        return document.querySelectorAll('.product-variant-2>div[style="display: block;"]>div').length;
      });

      const pV2 = await context.evaluate(() => {
        return document.querySelectorAll('.product-variant-2>div[style="display: block;"]>div');
      });
      for (let k = 0; k < pV2Length; k++) {
        if (pV2[k + 1] !== undefined) {
          await extractionHelper();
          await context.extract(productDetails, { transform }, 'MERGE_ROWS');

          await new Promise((resolve, reject) => setTimeout(resolve, 2000));

          await context.evaluate(() => {
            const clickingElement2 = document.querySelector("div[class*='selected-row']").nextElementSibling;
            if (clickingElement2 !== null) {
              clickingElement2.click();
            }
          });
        } else if (pV1[i] === undefined) {
          await extractionHelper();
          return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
        } else {
          await extractionHelper();
          await context.extract(productDetails, { transform }, 'MERGE_ROWS');

          await new Promise((resolve, reject) => setTimeout(resolve, 2000));
          if (pV1[i + 1] !== undefined) {
            await context.evaluate(() => {
              const clickingElement1 = document.querySelector('li.tab-title.active').nextElementSibling;
              if (clickingElement1 !== null) {
                clickingElement1.click();
              }
            });
          }
        }
      }
    }
  } else if (pV3Length > 1) {
    for (let l = 0; l < pV3Length; l++) {
      await new Promise((resolve, reject) => setTimeout(resolve, 300));
      if (pV3[l + 1] !== undefined) {
        await extractionHelper();
        await context.extract(productDetails, { transform }, 'MERGE_ROWS');

        await new Promise((resolve, reject) => setTimeout(resolve, 500));

        await context.evaluate(() => {
          const clickingElement3 = document.querySelector("div[class*='selected-row']").nextElementSibling;
          if (clickingElement3 !== null) {
            clickingElement3.click();
          }
        });
      } else {
        await extractionHelper();
        return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
      }
    }
  } else {
    await extractionHelper();
    return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
  }
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'windeln',
    transform: cleanUp,
    domain: 'windeln.de',
    zipcode: '',
  },
  implementation,
};
