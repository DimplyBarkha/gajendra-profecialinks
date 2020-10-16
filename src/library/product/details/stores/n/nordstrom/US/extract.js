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
     
     //selecting first variant to get price in case of range price
      document.querySelector('ul#size-filter-product-page-option-list li') && document.querySelector('ul#size-filter-product-page-option-list li').click();
      document.querySelector('ul#product-page-swatches li button') && document.querySelector('ul#product-page-swatches li button').click();
      document.querySelector('div#size-filter-product-page-anchor') && document.querySelector('div#size-filter-product-page-anchor').click();


      //video Url
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

      //variants
      var filterOption = window.__INITIAL_CONFIG__.stylesById.data[Object.keys(window.__INITIAL_CONFIG__.stylesById.data)[0]].filterOptions;
      var filters = window.__INITIAL_CONFIG__.stylesById.data[Object.keys(window.__INITIAL_CONFIG__.stylesById.data)[0]].filters;
      var styleMediaa = window.__INITIAL_CONFIG__.stylesById.data[Object.keys(window.__INITIAL_CONFIG__.stylesById.data)[0]].styleMedia.byId;
      styleMediaa[Object.keys(styleMediaa)[1]]
      var allIds= [] ;
      for (const property in filters) {
          for (let index = 0; index < filterOption.length; index++) {
              if (filterOption[index] === property) {
                  allIds.push(filters[property].allIds)
              }
          }
      }
      // console.log(allColorIds);
      
      for (let index = 0; index < allIds[0].length; index++) {
          console.log(styleMediaa[Object.keys(styleMediaa)[index]]);
      }

    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
