// @ts-nocheck

const { transform } = require('../../../../shared');
/**
 *
 * @param { { } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (

  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    // const applyScroll = async function (context) {
    //   // await context.evaluate(async function () {
    //   let scrollTop = 0;
    //   while (scrollTop !== 20000) {
    //     await stall(500);
    //     scrollTop += 1000;
    //     window.scroll(0, scrollTop);
    //     if (scrollTop === 20000) {
    //       await stall(6000);
    //       break;
    //     }
    //   }
    //   function stall(ms) {
    //     return new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         resolve();
    //       }, ms);
    //     });
    //   }
    // };
    function addHiddenDiv (id, content, productid, newID, fields) {
      console.log('Adding Custom div ', id, content, productid, newID, fields);
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      if (productid) {
        let originalDiv;
        const nodes = document.querySelectorAll("[data-automation*='product-results'] [data-automation*='product']");
        for (let i = 0; i < nodes.length; i++) {
          // eslint-disable-next-line eqeqeq
          if (nodes[i].getAttribute('data-product-id') == productid) {
            console.log('Adding UPC :: ', nodes[i].getAttribute('data-product-id'));
            originalDiv = nodes[i];
            originalDiv && originalDiv.appendChild(newDiv);
            break;
          }
        }
      } else if (newID && fields) {
        let originalDiv;
        const nodes = document.querySelectorAll("div[id='ii_products']");
        for (let i = 0; i < nodes.length; i++) {
          // eslint-disable-next-line eqeqeq
          if (nodes[i].getAttribute('data-ii-id') == newID) {
            originalDiv = nodes[i];
            originalDiv && originalDiv.appendChild(newDiv);
            break;
          }
        }
      } else if (newID) {
        // alert('new');
        newDiv.setAttribute('data-ii-id', newID);
        document.body.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
    }
    function fetchGTIN (mainDataObj) {
      const ids = Object.keys(mainDataObj);
      for (let i = 0; i < ids.length; i++) {
        const skus = mainDataObj[ids[i]] && mainDataObj[ids[i]].skus ? Object.keys(mainDataObj[ids[i]].skus) : [];
        const facet = skus && skus[0] && mainDataObj[ids[i]].skus[skus[0]].facets ? mainDataObj[ids[i]].skus[skus[0]].facets : [];

        for (let j = 0; j < facet.length; j++) {
          const obj = mainDataObj[ids[i]].skus[skus[0]].facets[j];

          if (obj && obj.name && obj.name.includes('UPC')) {
            addHiddenDiv('ii_upc', obj.value, ids[i]);
          }
        }
      }
    };
    // await applyScroll();
    const searchUrl = window.location.href.replace(/%20/g, ' ');
    addHiddenDiv('search-url', searchUrl);
    console.log('Start calling API');
    // Product API call
    let pageFetch = '';
    const productsToFetch = {};
    // If URL is paginated
    if (document.URL.includes('&p=')) {
      const searchTerm = document.URL.replace(/.*\/search\?q=(.*)&p=(.*)/, '$1');
      const page = document.URL.replace(/.*\/search\?q=(.*)&p=(.*)/, '$2');
      pageFetch = await fetch(`https://www.walmart.ca/api/bsp/search?experience=whiteGM&q=${searchTerm}&lang=en&p=${page}`, {
        method: 'GET',
      }).then((x) => x.text()).catch(e => JSON.stringify({ error: e }));
      console.log('Page Products to be::', pageFetch);
      if (pageFetch && pageFetch.includes('{') && pageFetch.includes('}') && JSON.parse(pageFetch)) {
        pageFetch = JSON.parse(pageFetch);
        productsToFetch.products = pageFetch.items && pageFetch.items.productsToFetch ? pageFetch.items.productsToFetch : {};
      };
      console.log('End of page fetch');
    } else {
      console.log('Window variable::', window.__PRELOADED_STATE__);
      const mainDataObj = window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.results && window.__PRELOADED_STATE__.results.entities && window.__PRELOADED_STATE__.results.entities.products ? window.__PRELOADED_STATE__.results.entities.products : {};
      mainDataObj && await fetchGTIN(mainDataObj);
      productsToFetch.products = window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.results && window.__PRELOADED_STATE__.results.entities && window.__PRELOADED_STATE__.results.entities.products ? window.__PRELOADED_STATE__.results.entities.productsToFetch : {};
    }
    console.log('Product ids to be fetched::', JSON.stringify(productsToFetch));
    if (productsToFetch && productsToFetch.products && productsToFetch.products.length > 0) {
      productsToFetch.lang = 'en';
      const response = await fetch('https://www.walmart.ca/api/bsp/fetch-products', {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(productsToFetch),
        method: 'POST',
      }).then((x) => x.text()).catch(e => JSON.stringify({ error: e }));
      console.log('Product fetch response::', response, 'end');
      if (response && response.includes('{') && response.includes('}') && JSON.parse(response)) {
        console.log('Inside responses');
        let responseJSON = JSON.parse(response);
        responseJSON = responseJSON.products ? responseJSON.products : responseJSON;
        if (responseJSON.error) {
          console.log('Failed to fetch products', responseJSON.error);
        }
        // Price API call
        productsToFetch.pricingStoreId = '1061';
        productsToFetch.fulfillmentStoreId = '1061';
        productsToFetch.experience = 'whiteGM';
        productsToFetch.fsa = 'L5V';
        productsToFetch.products = JSON.parse(JSON.stringify(productsToFetch.products).replace(/product_id/gm, 'productId').replace(/sku_id/gm, 'skuIds').replace(/"skuIds":"(.*?)"/gm, '"skuIds":["$1"]'));
        const price = await fetch('https://www.walmart.ca/api/bsp/v2/price-offer', {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
          body: JSON.stringify(productsToFetch),
          method: 'POST',
        }).then((x) => x.text()).catch(e => JSON.stringify({ error: e }));
        if (price.error) {
          console.log('Failed to fetch price', price.error);
        }
        console.log('Price API response::', price);
        const priceJSON = JSON.parse(price);
        const priceSKU = priceJSON.skus ? priceJSON.skus : {};
        const priceOffer = priceJSON.offers ? priceJSON.offers : {};
        for (const [key, value] of Object.entries(responseJSON)) {
          console.log(`${key}: ${value}`);
          const id = (value.id) ? value.id : '';
          const name = value.name && value.description ? value.name + ' | ' + value.description : (value.name) ? value.name : '';
          const ratingCount = value.rating && value.rating.totalCount ? value.rating.totalCount : '';
          const averageRating = value.rating && value.rating.averageRating ? value.rating.averageRating : '';
          let images = '';
          let productCurrentPrice = '';
          for (const [skuId, skuIdValue] of Object.entries(value.skus)) {
            // skuId = Number(skuId);
            console.log('SKU ', typeof skuId, skuId);
            console.log('price ', priceSKU, priceSKU[skuId]);
            const productOffer = priceSKU[skuId] && priceSKU[skuId][0] ? priceSKU[skuId][0] + '' : '';
            productCurrentPrice = productOffer && priceOffer[productOffer] && priceOffer[productOffer].currentPrice ? priceOffer[productOffer].currentPrice : '';
            if (!images && skuIdValue.images && skuIdValue.images[0] && skuIdValue.images[0].thumbnail && skuIdValue.images[0].thumbnail.url) {
              images = skuIdValue.images[0].thumbnail.url;
            }
            if (images && productCurrentPrice) {
              break;
            }
          };
          id && addHiddenDiv('ii_products', id, false, id);
          id && addHiddenDiv('ii_id', id, false, id, 'product-id');
          id && addHiddenDiv('ii_producturl', 'https://www.walmart.ca/en/ip/' + id, false, id, 'product-url');
          name && addHiddenDiv('ii_name', name, false, id, 'product-name');
          ratingCount && addHiddenDiv('ii_ratingCount', ratingCount, false, id, 'product-ratingCount');
          averageRating && addHiddenDiv('ii_averageRating', parseFloat(averageRating).toFixed(1), false, id, 'product-averageRating');
          productCurrentPrice && addHiddenDiv('ii_productCurrentPrice', '$' + productCurrentPrice, false, id, 'product-productCurrentPrice');
          images && addHiddenDiv('ii_images', images, false, id, 'product-images');
          console.log(id, name, ratingCount, averageRating, productCurrentPrice, images);
        }
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    transform,
    domain: 'walmart.ca',
    zipcode: '',
  },
  implementation,
};
