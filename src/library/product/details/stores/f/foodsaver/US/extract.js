const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'foodsaver',
    transform: transform,
    domain: 'foodsaver.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    const pageUrl = await context.evaluate(async () => {
      const nextButton = document.querySelector('div[class*="row product-grid"] div.product>div.product-tile>a');
      console.log('nextbutton', nextButton);
      if (nextButton) {
        const pareUrl = nextButton.getAttribute('href');
        console.log('pareUrl ====', pareUrl);
        if (pareUrl) {
          return pareUrl;
        }
      }
      return '';
    });
    console.log('pageUrl ===', pageUrl);
    if (pageUrl) {
      await context.goto(`https://www.foodsaver.com${pageUrl}`, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    }
    // const pareUrl = await context.evaluate(async function () {
    //   // const productpage = async function () {
    //   // function timeout (ms) {
    //   //   return new Promise((resolve) => setTimeout(resolve, ms));
    //   // }
    //   const nextButton = document.querySelector('div[class*="row product-grid"] div.product>div.product-tile>a');
    //   console.log('nextbutton', nextButton);
    //   if (nextButton) {
    //     const pareUrl = nextButton.getAttribute('href');
    //     console.log('pareUrl ====', pareUrl);
    //     if (pareUrl) {
    //       return pareUrl;
    //       await context.goto(pareUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    //     }
    //     // nextButton.click();
    //     // await timeout(50000);
    //   }
    //   // };
    //   // productpage();
    // });
    await context.evaluate(async () => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        const image = document.evaluate('(//img[@itemprop="image"])[position()=1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (image && image.src) {
          const imageOne = image.src;
          if (imageOne.includes('wid=180&hei=180')) {
            addHiddenDiv('pd_image', imageOne.replace('wid=180&hei=180', 'wid=1200&hei=1200'));
          } else {
            addHiddenDiv('pd_image', imageOne);
          }
        }
      } catch (error) {
        console.log('Image fetch failed');
      }
      try {
        const dataObj = JSON.parse(document.querySelector('span.product-object').getAttribute('data-product'));
        if (dataObj) {
          dataObj.id && addHiddenDiv('variantId', dataObj.id);
          dataObj.price && addHiddenDiv('pd_price', dataObj.price);
          dataObj.product_sku && addHiddenDiv('pd_sku', dataObj.product_sku);
          dataObj.brand && addHiddenDiv('pd_brand', dataObj.brand);
        }
      } catch (error) {
        console.log('add variantid failed!!');
      }
      try {
        const dataObjTwo = JSON.parse(document.evaluate('//script[@type="application/ld+json" and contains(text(),"mpn")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText);
        if (dataObjTwo) {
          dataObjTwo.mpn && addHiddenDiv('pd_mpc', dataObjTwo.mpn);
        }
      } catch (error) {
        console.log('add mpc failed!!');
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
