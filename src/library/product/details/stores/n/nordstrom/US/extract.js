const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'nordstrom',
    transform,
    domain: 'nordstrom.com',
  },
  implementation: async (
    // @ts-ignore
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      var checkPriceRange = document.querySelector('section#product-page-price-lockup span#current-price-string') && document.querySelector('section#product-page-price-lockup span#current-price-string').textContent && document.querySelector('section#product-page-price-lockup span#current-price-string').textContent.includes('–');
      if (checkPriceRange) {
        // @ts-ignore
        document.querySelector('div#size-filter-product-page-anchor') && document.querySelector('div#size-filter-product-page-anchor').click();
        // @ts-ignore
        document.querySelector('ul#size-filter-product-page-option-list li') && document.querySelector('ul#size-filter-product-page-option-list li').click();
        // @ts-ignore
        document.querySelector('ul#product-page-swatches li button') && document.querySelector('ul#product-page-swatches li button').click();
      }

      const videoUrls = [];
      // @ts-ignore
      const dataArr = window.__INITIAL_CONFIG__.viewData;
      const videoID = dataArr.salesVideoShot ? dataArr.salesVideoShot.id : dataArr.vendorVideoShot ? dataArr.vendorVideoShot.id : '';
      if (videoID) {
        videoUrls.push(videoID);
      }

      if (videoUrls.length) {
        videoUrls.map(ele => {
          const videoUrl = 'https://fast.wistia.net/embed/iframe/' + ele;
          const element = document.createElement('a');
          element.setAttribute('class', 'appendedvideo');
          element.href = videoUrl;
          document.body.appendChild(element);
        });
      }

      const variants = dataArr.filters && dataArr.filters.color && dataArr.filters.color.byId;
      const checkvariants = variants && variants[Object.keys(variants)[0]] && variants[Object.keys(variants)[0]].value;
      if (checkvariants) {
        const variantID = dataArr.filters && dataArr.filters.color && dataArr.filters.color.allIds;
        variantID.map(ele => {
          const element = document.createElement('a');
          element.setAttribute('class', 'appendedvariantid');
          element.href = ele;
          document.body.appendChild(element);
        });
      }

      const finalArray = [];
      const rpc = dataArr && dataArr.skus && dataArr.skus.allIds && dataArr.skus.allIds[0] ? dataArr.skus.allIds[0] : '';
      const size = dataArr && dataArr.filters && dataArr.filters.size && dataArr.filters.size.allIds[0] ? dataArr.filters.size.allIds[0] : '';
      const object = { rpc, size };
      finalArray.push(object);
      if (finalArray) {
        for (const key in finalArray[0]) {
          document.body.setAttribute(key, finalArray[0][key]);
        }
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
