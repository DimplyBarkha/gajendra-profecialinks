async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    try {
      const isCookieSelector = document.querySelector('div.ot-sdk-container div#onetrust-close-btn-container button.onetrust-close-btn-handler');
      if (isCookieSelector) {
        isCookieSelector.click();
      }
    } catch (err) {
      console.log('No cookie selector loaded' + err);
    }
    const appendElements = (id, text) => {
      const appendElement = document.createElement('div');
      appendElement.id = id;
      appendElement.innerText = text;
      appendElement.style.display = 'none';
      document.body.append(appendElement);
    }
    const isZoomFeaturePresent = document.querySelector('li[data-key="zoomIn"]') ? 'Yes' : 'No';
    appendElements('iszoomfeaturepresent', isZoomFeaturePresent);
    const size = document.evaluate('//select[@id="size"]/option[@selected]', document).iterateNext() && document.evaluate('//select[@id="size"]/option[@selected]', document).iterateNext().textContent;
    appendElements('productsize', size);
    const productUrl = window.location.href;
    const rpc = productUrl.replace(/(.+)(\-)(\d+)(\.html)(.+)/g, '$3');
    appendElements('producturl', productUrl);
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const skuArray = []
    const gtinArray = []
    const availabilityArray = []
    scripts.forEach((element) => {
      let jsonData = JSON.parse(element && element.innerText);
      skuArray.push(jsonData && jsonData.sku)
      gtinArray.push(jsonData && jsonData.gtin13)
      availabilityArray.push(jsonData && jsonData.offers && jsonData.offers.availability)
    })
    let gtin = '';
    let availabilityStatus = '';
    skuArray.forEach((element, index) => {
      if (rpc === element) {
        gtin = gtinArray[index];
        availabilityStatus = availabilityArray[index];
      }
    })
    appendElements('gtinvalue', gtin);
    appendElements('availabilitystatus', availabilityStatus);
    const getVariantData = () => {
      let rpcArray = []
      let scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach((element) => {
        let jsonData = JSON.parse(element && element.innerText);
        rpcArray.push(jsonData && jsonData.sku);
      })
      let variantCount = rpcArray.length;
      let variantDataString = rpcArray.join(' | ')
      let firstVariant = rpcArray[0];
      return {
        variantCount,
        variantDataString,
        firstVariant
      }
    }
    const { variantCount, variantDataString, firstVariant } = getVariantData();
    appendElements('variantcount', variantCount);
    appendElements('variantdatastring', variantDataString);
    appendElements('firstvariant', firstVariant);

    //code for getting the description data
    const getDescription = () => {
      const description = document.evaluate('//b[contains(text(),"DESCRIPTION")]/following-sibling::p[1]', document) && document.evaluate('//b[contains(text(),"DESCRIPTION")]/following-sibling::p[1]', document).iterateNext() && document.evaluate('//b[contains(text(),"DESCRIPTION")]/following-sibling::p[1]', document).iterateNext().textContent;
      return description;
    }
    const getBulletData = () => {
      const bulletPointData = document.evaluate('//*[contains(text(),"Key Benefits")]/../following-sibling::li/text()[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const bulletPointArray = [];
      for (let i = 0; i < bulletPointData.snapshotLength; i++) {
        const data = bulletPointData.snapshotItem(i).textContent;
        bulletPointArray.push(data);
      }
      const bulletDataString = bulletPointArray.map(element => element.trim()).join(' || ');
      const totalBulletPoint = bulletPointArray.length;
      return {
        bulletDataString,
        totalBulletPoint
      };
    }
    const getFinalDescription = (description, bulletData) => {
      const finalDescriptionString = `${description} || ${bulletData}`;
      return finalDescriptionString;
    }
    let description = getDescription();
    let { bulletDataString, totalBulletPoint } = getBulletData();
    if (description == undefined) {
      description = ''
    }
    if (bulletDataString == undefined) {
      bulletDataString = '';
    }
    const finalDescription = getFinalDescription(description, bulletDataString);
    appendElements('finaldescription', finalDescription);
    appendElements('bulletdata', bulletDataString);
    appendElements('totalbullets', totalBulletPoint);
    //code for getting the ingredient information
    const ingredientButton = document.evaluate('//div[contains(text(),"Ingredients")]', document).iterateNext();
    if (ingredientButton) {
      ingredientButton.click();
    }
    const getIngredientsData = () => {
      const ingredientData = document.evaluate('//*[contains(text(),"Ingredients")]/../text()', document).iterateNext() && document.evaluate('//*[contains(text(),"Ingredients")]/../text()', document).iterateNext().textContent;
      return ingredientData
    }
    const ingredientData = getIngredientsData();
    appendElements('ingredientinfos', ingredientData);
    //code for switching to direction information
    const directionButton = document.evaluate('//div[contains(text(),"Directions")]', document).iterateNext();
    if (directionButton) {
      directionButton.click();
    }
    //code for extracting the video data
    const videoPlayButton = document.evaluate('//div[contains(@class,"viewer-selection")]//div[contains(@class,"slick-list")]//div[contains(@class,"slick-slide")][not(contains(@class,"cloned"))]//div[contains(@class,"vid-thumbnail-overlay")]', document) && document.evaluate('//div[contains(@class,"viewer-selection")]//div[contains(@class,"slick-list")]//div[contains(@class,"slick-slide")][not(contains(@class,"cloned"))]//div[contains(@class,"vid-thumbnail-overlay")]', document).iterateNext();
    if (videoPlayButton) {
      videoPlayButton.click()
    }
    const videoLink = document.evaluate('//div[contains(@class,"ReactModalPortal")]//video[contains(@class,"video")]/source/@src', document).iterateNext() && document.evaluate('//div[contains(@class,"ReactModalPortal")]//video[contains(@class,"video")]/source/@src', document).iterateNext().textContent;
    appendElements('productvideolink', videoLink);
  });

  try {
    await context.waitForSelector('div[class="react-viewer-canvas"]>img', { timeout: 50000 });
    console.log(`selector loaded successfully`)
  } catch (e) {
    console.log(`selector did not load at all`);
  }
  return await context.extract(productDetails, { transform });
}
const { cleanUp } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'petsmart',
    transform: cleanUp,
    domain: 'petsmart.com',
    zipcode: '',
  },
  implementation,
};
