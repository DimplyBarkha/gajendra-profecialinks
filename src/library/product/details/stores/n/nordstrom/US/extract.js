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
      function timeout (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
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
      try {
        const varinatInformation = [];
        const id = document.querySelector('meta[property="og:url"]').getAttribute('content');
        const pId = id.match(/\d+$/g) && id.match(/\d+$/g)[0];
        const styleDetails = window.__INITIAL_CONFIG__.stylesById.data[pId];
        let types = styleDetails.filterOptions;
        if (types.length === 0) {
          types = ['color'];
        }
        const filters = styleDetails.filters;
        for (const type of types) {
          const ids = filters[type].allIds;

          for (const varId of ids) {
            const varinatInfo = {};
            const variant = filters[type].byId[varId];
            const priceSku = [];
            priceSku.push(variant.relatedSkuIds[0]);
            for (const val of priceSku) {
              var data = styleDetails.price.bySkuId[val];
            }
            Object.assign(varinatInfo, {
              media: [],
              variantId: variant.id,
              sku: variant.relatedSkuIds[0],
              value: variant.value,
              price: data.priceString,
              listPrice: data.originalPriceString,
            });
            const mediaIds = filters[type].byId[varId].styleMediaIds;
            if (!mediaIds) {
              if (styleDetails.filters.color.byId[94727]) {
                const stMediaIds = styleDetails.filters.color.byId[94727].styleMediaIds;
                if (stMediaIds) {
                  for (var stMediaId of stMediaIds) {
                    var media = styleDetails.styleMedia.byId[stMediaId];
                    varinatInfo.media.push({
                      mediaType: media.mediaType,
                      imageMediaUri: media.imageMediaUri.maxLargeDesktop,
                    });
                  }
                }
              }
              await timeout(5000);
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

            const price = document.createElement('td');
            price.setAttribute('class', 'price');
            price.setAttribute('price', varinatInformation[index].price);
            newlink.appendChild(price);

            const listPriceValue = document.querySelector('#original-price');
            if (listPriceValue) {
              const listPrice = document.createElement('td');
              listPrice.setAttribute('class', 'listprice');
              listPrice.setAttribute('listprice', varinatInformation[index].listPrice);
              newlink.appendChild(listPrice);
            }
            const variant = document.createElement('td');
            variant.setAttribute('class', 'variant');
            variant.textContent = varinatInformation[index].value;
            newlink.appendChild(variant);

            const image = document.createElement('td');
            image.setAttribute('class', 'images');
            newlink.appendChild(image);
            if (varinatInformation[index].media) {
              for (let j = 0; j < varinatInformation[index].media.length; j++) {
                const img = document.createElement('img');
                img.setAttribute('class', 'img');
                img.setAttribute('src', varinatInformation[index].media[j].imageMediaUri);
                image.appendChild(img);
              }
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
      } catch (error) {
        console.log(error.message);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
