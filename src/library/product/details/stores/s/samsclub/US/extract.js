const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    transform,
    domain: 'samsclub.com',
  },
  implementation
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    const popUps = document.querySelector('div.sc-modal-content button.sc-modal-close-button')
    if (popUps) {
      popUps.click();
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 30000));
  });

  const itemUrl = await context.evaluate(function () {
    const itemCheck = '//div[@class="sc-infinite-loader undefined"]//ul//li//a';
    var checkElement = document.evaluate(itemCheck, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (checkElement.snapshotLength > 0) {
      const url = checkElement.snapshotItem(0).href;
      console.log("url",url)
      return url;
    } else {
      return null;
    }
  });
  if (itemUrl) {
    await context.goto(itemUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    await context.click('div.sc-modal-content button.sc-modal-close-button');
    await new Promise((resolve, reject) => setTimeout(resolve, 40000));
  }
  await context.evaluate(async function () {
    await new Promise((resolve, reject) => setTimeout(resolve, 40000));
    let getManufatureImageArray = [];
    let getManufatureTextArray = [];
    let getManufatureImageFromShadowArray = [];
    let getManufatureTextFromShadowArray = [];
    let getContent = document.querySelector('iframe#wcframable1-1');
    let getContetImage = document.querySelector('div.syndigo-shadowed-powerpage');
    if (getContent) {
      let getManufatureImage = getContent.contentDocument.querySelectorAll('div.wc-media-available img');
      if (getManufatureImage) {
        for (let i = 0; i < getManufatureImage.length; i++) {
          let urls = getManufatureImage[i].src;
          getManufatureImageArray.push(urls);
        }
        console.log("getManufatureImageArray", getManufatureImageArray);
      }
      let getManufatureText = getContent.contentDocument.querySelectorAll('div.wc-media-available');
      if (getManufatureText) {
        for (let i = 0; i < getManufatureText.length; i++) {
          let text = getManufatureText[i].innerText;
          getManufatureTextArray.push(text);
        }
        console.log("getManufatureTextArray", getManufatureTextArray);
      }
    }
    if (getContetImage) {
      let scrollTop = 0;
      while (scrollTop !== 70000) {
        await stall(500);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 70000) {
          await stall(5000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      // await new Promise((resolve, reject) => setTimeout(resolve, 40000));
      let getImagesFromShadow = getContetImage.shadowRoot.querySelectorAll('img');
      console.log("getImagesFromShadow", getImagesFromShadow)
      if (getImagesFromShadow) {
        for (let i = 0; i < getImagesFromShadow.length; i++) {
          let urls2 = getImagesFromShadow[i].src;
          getManufatureImageFromShadowArray.push(urls2);
        }
        console.log("getManufatureImageFromShadowArray1", getManufatureImageFromShadowArray);
      }

      let getTextFromShadow = getContetImage.shadowRoot.querySelectorAll('div.syndi_powerpage');
      if (getTextFromShadow) {
        for (let i = 0; i < getTextFromShadow.length; i++) {
          let text1 = getTextFromShadow[i].innerText;
          getManufatureTextFromShadowArray.push(text1);
        }
        console.log("getManufatureTextFromShadowArray1", getManufatureTextFromShadowArray);
      }

    }
    function addHiddenDiv(elementID, content) {
      const newDiv = document.createElement('div');
      newDiv.id = elementID;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    addHiddenDiv('getManufatureImageArray1', getManufatureImageArray.join('  || '));
    addHiddenDiv('getManufatureTextArray1', getManufatureTextArray);
    addHiddenDiv('getManufatureImageFromShadowArray11', getManufatureImageFromShadowArray.join('  || '));
    addHiddenDiv('getManufatureTextFromShadowArray12', getManufatureTextFromShadowArray.join('  || '));
  });
  return await context.extract(productDetails, { transform });
}