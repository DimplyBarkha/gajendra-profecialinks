
const { cleanUp } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    transform: cleanUp,
    domain: 'nykaa.com',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const check = async () => {
      return await context.evaluate(() => {
        const isPresent = document.querySelector('p[class="sorry-text"]');
        if (isPresent) {
          return true;
        } else {
          return false;
        }
      });
    };
    const noResultXpathCheck = await check();
    if (noResultXpathCheck) {
      console.log('noResultXpath found');
      return;
    }
    const currentSelector = 'div.pdp-description-tab-readmore';
    const result = await context.evaluate((currentSelector) => {
      return Boolean(document.querySelector(currentSelector));
    }, currentSelector);

    if (result) {
      await context.click('div.pdp-description-tab-readmore');
      console.log('Clicked');
      await context.waitForNavigation();
    }
    await context.evaluate(async function (inputs) {
      const productUrl = inputs.URL.toLocaleLowerCase();
      const urlEle = document.createElement('div');
      urlEle.className = 'currentProductURL';
      let currentUrlVariantId = null;
      let matchingString = 'skuid=';
      let variantsArray = productUrl.substring(productUrl.lastIndexOf(matchingString) + 6, productUrl.length).match(/(\d+)/g);
      currentUrlVariantId = variantsArray && variantsArray.length > 0 ? variantsArray[0] : null;
      if (currentUrlVariantId === null) {
        matchingString = 'p/';
        variantsArray = productUrl.substring(productUrl.lastIndexOf(matchingString) + 2, productUrl.length).match(/(\d+)/g);
        currentUrlVariantId = variantsArray && variantsArray.length > 0 ? variantsArray[0] : null;
      }
      urlEle.textContent = currentUrlVariantId;
      document.body.appendChild(urlEle);

      const videoArr = [];
      var thumbnailVideo = document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext() && document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent;
      const obj = JSON.parse(thumbnailVideo && thumbnailVideo.split('window.__PRELOADED_STATE__ =')[1] && thumbnailVideo.split('window.__PRELOADED_STATE__ =')[1].split('window.__NODE_ENV__')[0]);
      const videoLinks = obj && obj.productReducer && obj.productReducer.product && obj.productReducer.product.media.find(ele => ele.type === 'video');

      if (videoLinks) {
        videoArr.push(videoLinks.url);
      }
      const descriptionVideo = document.querySelectorAll('section iframe');
      if (descriptionVideo.length) {
        descriptionVideo.forEach(ele => {
          const videoLinks = ele.getAttribute('src');
          videoArr.push(videoLinks);
        });
      }
      if (videoArr.length) {
        videoArr.forEach(res => {
          const newLink = document.createElement('li');
          newLink.className = 'VideoLinks';
          newLink.textContent = res;
          document.body.appendChild(newLink);
        });
      }
      const skuIds = obj && obj.productReducer && obj.productReducer.product && obj.productReducer.product.options;
      if (skuIds && skuIds.length) {
        skuIds.forEach(res => {
          const newLink = document.createElement('li');
          newLink.className = 'sku';
          newLink.textContent = res.product_id;
          document.body.appendChild(newLink);
        });
      }
      const howToUse = obj && obj.productReducer && obj.productReducer.product && obj.productReducer.product.how_to_use.replace(/<[^>]*>/g, '');
      document.body.setAttribute('how_to_use', howToUse);
      let brand = document.evaluate('//*[@class="pdp-description-tab-item description-expand"]//p[contains(text(),"Name of")]', document).iterateNext() && document.evaluate('//*[@class="pdp-description-tab-item description-expand"]//p[contains(text(),"Name of")]', document).iterateNext().textContent.replace(/(.+):(.+)/g, '$2');
      if (!brand) {
        brand = obj && obj.productReducer && obj.productReducer.product && obj.productReducer.product.brand_name[0];
      }
      document.body.setAttribute('brand', brand);
      const scrpt = document.querySelectorAll('script');
      let outScript = '';
      scrpt.forEach((element) => {
        if (element.innerText.includes('window.__PRELOADED_STATE')) {
          outScript = element;
        }
      });
      const data1 = outScript.innerText && outScript.innerText.split(',');
      let id = '';
      data1.forEach((element) => {
        const skuValue = element.split(':');
        skuValue.forEach((element2, index) => {
          if (element2 == '"sku"') {
            id = skuValue[index + 1];
          }
        });
      });

      const imgurl = document.querySelector('div[class*="post-card__img"]>div>img') && document.querySelector('div[class*="post-card__img"]>div>img').getAttribute('src');
      const id1 = imgurl && imgurl.match(/\d{4,}/g) && imgurl.match(/\d{4,}/g)[0];
      let sku = '';
      if (id != '') {
        sku = id;
      } else {
        sku = id1;
      }
      var appendElement = document.querySelector('div[class*="post-card__img-wrap1"] img');
      appendElement.setAttribute('sku', sku);

      const ingredientData = obj && obj.productReducer && obj.productReducer.product && obj.productReducer.product.product_ingredients;
      const finalInagredientData = ingredientData.replace(/<p>(.+)<\/p>/g, '$1');

      var appendElement = document.querySelector('div[class*="post-card__img-wrap1"] img');
      appendElement.setAttribute('finalInagredientData', finalInagredientData);
      const link = window.location.href;
      const rpc = link.match(/skuId=\d+/g) && link.match(/skuId=\d+/g)[0];
      let finalRpc = rpc && rpc.match(/\d+/g) && rpc.match(/\d+/g)[0];
      if (rpc == null) {
        const temp = link.match(/p\/\d+/g) && link.match(/p\/\d+/g)[0];
        finalRpc = temp && temp.match(/\d+/g) && temp.match(/\d+/g)[0];
      }
      // const link = window.location.href
      // let finalRpc = link.match(/(p\/)(\d+)/g)[0].match(/\d+/g)[0];
      appendElement.setAttribute('rpcvalue', finalRpc);
    }, inputs);

    return await context.extract(productDetails, { transform });
  },
};
