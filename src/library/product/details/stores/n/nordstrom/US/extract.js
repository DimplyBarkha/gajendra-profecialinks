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
      document.querySelector('ul#size-filter-product-page-option-list li') && document.querySelector('ul#size-filter-product-page-option-list li').click();
      document.querySelector('ul#product-page-swatches li button') && document.querySelector('ul#product-page-swatches li button').click();
      document.querySelector('div#size-filter-product-page-anchor') && document.querySelector('div#size-filter-product-page-anchor').click();

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

      const varinatInformation = [];
      const id = document.querySelector('meta[property="og:url"]').getAttribute('content');
      const pId = id.match(/\d+$/g) && id.match(/\d+$/g)[0];
      const styleDetails = window.__INITIAL_CONFIG__.stylesById.data[pId];
      const types = styleDetails.filterOptions;
      const filters = styleDetails.filters;

      for (const type of types) {
        const ids = filters[type].allIds;

        for (const varId of ids) {
          const varinatInfo = {};
          const variant = filters[type].byId[varId];
          Object.assign(varinatInfo, {
            media: [],
            variantId: variant.id,
            sku: variant.relatedSkuIds[0],
            value: variant.value,
          });
          const mediaIds = filters[type].byId[varId].styleMediaIds;
          if (!mediaIds) {
            varinatInformation.push(varinatInfo);
            continue;
          }

          for (const mediaId of mediaIds) {
            const media = styleDetails.styleMedia.byId[mediaId];
            varinatInfo.media.push({
              mediaType: media.mediaType,
              imageMediaUri: media.imageMediaUri.maxLargeDesktop,
            });
          }

          varinatInformation.push(varinatInfo);
        }
      }

      console.log(varinatInformation);
      if (varinatInformation.length) {
        const table = document.createElement('table');
        document.body.appendChild(table);
        const tBody = document.createElement('tbody');
        table.appendChild(tBody);

        for (let index = 0; index < varinatInformation.length; index++) {
          const newlink = document.createElement('tr');
          newlink.setAttribute('class', 'append_variant');
          newlink.setAttribute('variant_id', varinatInformation[index].variantId);
          tBody.appendChild(newlink);

          const sku = document.createElement('td');
          sku.setAttribute('class', 'sku');
          sku.setAttribute('sku', varinatInformation[index].sku);
          newlink.appendChild(sku);

          const variant = document.createElement('td');
          variant.setAttribute('class', 'variant');
          variant.textContent = varinatInformation[index].value;
          newlink.appendChild(variant);

          const image = document.createElement('td');
          image.setAttribute('class', 'images');
          newlink.appendChild(image);

          for (let j = 0; j < varinatInformation[index].media.length; j++) {
            const img = document.createElement('img');
            img.setAttribute('class', 'img');
            img.setAttribute('src', varinatInformation[index].media[j].imageMediaUri);
            image.appendChild(img);
          }
        }
      } else {
        const table = document.createElement('table');
        document.body.appendChild(table);
        const tBody = document.createElement('tbody');
        table.appendChild(tBody);
        const tr = document.createElement('tr');
        tr.setAttribute('class', 'append_variant');
        tBody.appendChild(tr);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
