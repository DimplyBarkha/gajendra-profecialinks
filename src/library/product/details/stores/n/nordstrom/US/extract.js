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
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      document.querySelector('div#size-filter-product-page-anchor') && document.querySelector('div#size-filter-product-page-anchor').click();
      document.querySelector('ul#size-filter-product-page-option-list li') && document.querySelector('ul#size-filter-product-page-option-list li').click();
      document.querySelector('ul#product-page-swatches li button') && document.querySelector('ul#product-page-swatches li button').click();

      const videoUrls = [];
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



      var variantArr = [];
      var variantCount = 0;
      var variants = window.__INITIAL_CONFIG__.stylesById.data;
      if (Object.keys(variants).length) {
        var checksize = variants && variants[Object.keys(variants)[0]] && variants[Object.keys(variants)[0]].filters && variants[Object.keys(variants)[0]].filters.size && variants[Object.keys(variants)[0]].filters.size.byId;
        var checkcolour = variants && variants[Object.keys(variants)[0]].filters && variants[Object.keys(variants)[0]].filters.color && variants[Object.keys(variants)[0]].filters.color.allIds;
        if (Object.keys(checksize).length && checkcolour.length > 1) {
          for (const property in checksize) {
            const variantId = `${property} - ${checksize[property].isAvailableWith.substring(0, checksize[property].isAvailableWith.length - 1).replace(/_c:/g, '')}`
            var variantCount = variantCount +  Number(`${checksize[property].relatedSkuIds.length}`);
            variantArr.push(variantId);
            console.log(variantId);
          }
        }
        if (checkcolour.length && !Object.keys(checksize).length) {
          variantArr = checkcolour;
          variantCount = variantArr.length
        }
        if (checkcolour.length === 1) {
          for (const property in checksize) {
            const variantId = `${property}`
            variantArr.push(variantId);
            variantCount = variantArr.length
            console.log(`${property}`);
          }
        }
      }
      variantArr.map(ele => {
        const element = document.createElement('a');
        element.setAttribute('class', 'appendedvariantid');
        element.href = ele;
        document.body.appendChild(element);
      });
      if(variantCount > 1) {
        document.body.setAttribute('variant_count',variantCount.toString())
      }
      const finalArray = [];
      const rpc = dataArr && dataArr.skus && dataArr.skus.allIds && dataArr.skus.allIds[0] ? dataArr.skus.allIds[0] : '';
      const size = dataArr && dataArr.filters && dataArr.filters.size && dataArr.filters.size.allIds;
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
