// @ts-nocheck
const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll("button[class*='e30m82v2']")) ? document.querySelectorAll("button[class*='e30m82v2']").length : 0;
  });
  const variantColorLength = await context.evaluate(async () => {
    return (document.querySelectorAll("button[class*='e30m82v2']")) ? document.querySelectorAll("button[class*='e30m82v2']").length : 0;
  });

  const variantSizeLength = await context.evaluate(async () => {
    return (document.querySelectorAll("button[class*='e30m82v3']")) ? document.querySelectorAll("button[class*='e30m82v3']").length : 0;
  });

  if (variantColorLength !== 0 && variantSizeLength !== 0) {
    variantLength = variantColorLength * variantSizeLength;
  } else {
    variantLength = variantColorLength === 0 ? variantSizeLength : variantColorLength;
  }

  async function preparePage (index, variantLength, variantColorLength, variantSizeLength) {
    await context.evaluate(async (index, variantLength, variantColorLength, variantSizeLength) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
      let firstVariant = '';
      const productData = window.__PRELOADED_STATE__;
      if (productData) {
        let totalVariant = Object.keys(productData.entities.skus).length;
        console.log('variantColorLength', variantColorLength, variantSizeLength);
        if (variantColorLength === 0 && variantSizeLength === 0) {
          totalVariant = 0;
        } else {
          firstVariant = productData.product.activeSkuId;
          addHiddenDiv('ii_firstVariant', firstVariant);
          const variants = productData.product.item.skus;
          console.log('productData.product.skus.length', productData, productData.product, productData.product.skus);
          addHiddenDiv('ii_variants', variants);
        }
        console.log('totalVariant', totalVariant);
        addHiddenDiv('ii_totalvariant', totalVariant);
        const rating = productData.product.item.rating.averageRating;
        rating != 0 && addHiddenDiv('ii_rating', rating);
      }
      // nameExtended
      // @ts-ignore
      const brand = document.querySelector("span[data-automation*='brand']") ? document.querySelector("span[data-automation*='brand']").innerText.trim() : '';
      const title = document.querySelector("h1[data-automation*='product-title']") ? document.querySelector("h1[data-automation*='product-title']").innerText.trim() : '';
      let nameExtended = '';
      if (brand && title) {
        nameExtended = brand + ' - ' + title;
      } else {
        nameExtended = title;
      }
      addHiddenDiv('ii_name', title);
      addHiddenDiv('ii_nameExtended', nameExtended);
      // decription
      let description = document.evaluate("//div[@data-automation='long-description']", document, null, XPathResult.ANY_TYPE, null);
      description = description.iterateNext().innerText;

      const additionalDescription = document.querySelector("div[data-automation='feature-specifications']").innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/gm, ' ').trim();
      description = (description + ' ' + additionalDescription).replace(/•/g, '||').replace(/\s{2,}/gm, ' ').trim();
      addHiddenDiv('ii_desc', description);
      // Enhanced Content
      const iframe = document.querySelectorAll('div[id*="wc-power-page"] iframe') ? document.querySelectorAll('div[id*="wc-power-page"] iframe') : null;
      let aplusImage = [];
      let videos = [];
      for (let i = 0; i < iframe.length; i++) {
        const dom = (iframe[i].contentDocument.documentElement.innerHTML).toString();
        // console.log('dom', dom);
        if (iframe) {
          const manufactureImage = dom.replace(/\n{2,}/, ' ').replace(/\s{2,}/, ' ').match(/<img src="(.*?)"|<img .*src="(.*?)"/);
          const video = dom.replace(/\n{2,}/, ' ').replace(/\s{2,}/, ' ').match(/<video src="(.*?)"|<video .*src="(.*?)"/);
          // console.log(video);
          if (manufactureImage) {
            manufactureImage[1] && aplusImage.push(manufactureImage[1]) && console.log(manufactureImage[1]);
            manufactureImage[2] && aplusImage.push(manufactureImage[2]) && console.log(manufactureImage[2]);
          }
          if (video) {
            video[1] && videos.push(video[1]) && console.log(video[1]);
            video[2] && videos.push(video[2]) && console.log(video[2]);
          }
        }
      }
      const enhancedImg = document.querySelectorAll("div[id*='wc-power-page'] img");
      const enhancedVideo = document.querySelectorAll("div[id*='wc-power-page'] video");
      if (enhancedVideo) {
        for (let i = 0; i < enhancedVideo.length; i++) {
          videos.push(enhancedVideo[i].src);
        }
      }
      if (enhancedImg) {
        for (let i = 0; i < enhancedImg.length; i++) {
          aplusImage.push(enhancedImg[i].src);
        }
      }
      aplusImage = [...new Set(aplusImage)];
      videos = [...new Set(videos)];
      videos.length > 0 && addHiddenDiv('ii_videos', videos.join(' | '));
      aplusImage.length > 0 && addHiddenDiv('ii_enhancedimages', aplusImage.join(' | '));
      let manufactureDesc = '';
      const nodes = document.evaluate("//div[contains(@id,'wc-power-page')]/div/*[not(div[contains(@class,'wc-aplus-body')]//div[contains(@class,'json')])]", document, null, XPathResult.ANY_TYPE, null);
      let nodeEle = nodes.iterateNext();
      while (nodeEle) {
        // @ts-ignore
        manufactureDesc += nodeEle.textContent + ' ';
        nodeEle = nodes.iterateNext();
      }
      addHiddenDiv('ii_manufactureDesc', manufactureDesc.replace(/\n/gm, ' ').replace(/\s{2,}/gm, ' ').trim());
    }, index, variantLength, variantColorLength, variantSizeLength);
  }

  console.log(variantLength, variantColorLength, variantSizeLength);

  if (variantLength > 1) {
    if (variantColorLength && variantSizeLength) {
      for (let index = 0; index < variantColorLength; index++) {
        await context.click(`button[class*='e30m82v2']:nth-child(${index + 1})`);
        for (let j = 0; j < variantSizeLength; j++) {
          await context.click(`button[class*='e30m82v3']:nth-child(${j + 1})`);
          if (index <= variantLength - 2) {
            console.log('Inside variants', index);
            await preparePage(index, variantLength);
            await context.extract(productDetails, { transform }, { type: 'APPEND' });
          }
        }
      }
    }
    if (variantSizeLength === 0) {
      for (let index = 0; index < variantColorLength; index++) {
        await context.click(`button[class*='e30m82v2']:nth-child(${index + 1})`);
        if (index <= variantLength - 2) {
          console.log('Inside variants', index);
          await preparePage(index, variantLength);
          await context.extract(productDetails, { transform }, { type: 'APPEND' });
        }
      }
    }
    if (variantColorLength === 0) {
      for (let index = 0; index < variantSizeLength; index++) {
        await context.click(`button[class*='e30m82v3']:nth-child(${index + 1})`);
        if (index <= variantLength - 2) {
          console.log('Inside variants', index);
          await preparePage(index, variantLength, variantColorLength, variantSizeLength);
          await context.extract(productDetails, { transform }, { type: 'APPEND' });
        }
      }
    }
  }

  if (variantLength) {
    await preparePage(variantLength - 1, variantLength, variantColorLength, variantSizeLength);
  } else {
    await preparePage(0, 0, variantColorLength, variantSizeLength);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    transform,
    domain: 'walmart.ca',
    zipcode: '',
  },
  implementation,
};
