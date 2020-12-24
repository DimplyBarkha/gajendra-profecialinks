const { transform } = require('./shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const addOptionalWait = async (selector) => {
    try {
      await context.waitForSelector(selector, { timeout: 20000 })
      console.log(`${selector} loaded susccessfully`)
    } catch (e) {
      console.log(`${selector} did not load at all`)
    }
  }
  await context.evaluate(() => {
    const clickButton = document.querySelector('button[class="btn green js-accept-all"]');
    if (clickButton) {
      clickButton.click();
    }
  })
  await context.evaluate(() => {
    const scriptElements = document.querySelectorAll('script[type="application/ld+json"]');
    const informationScript = [...scriptElements].find((element) => element.innerText.includes('availability'));

    const jsonData = informationScript && informationScript.innerText && JSON.parse(informationScript.innerText);
    const availabilityStatus = jsonData && jsonData.offers && jsonData.offers.availability;
    const availabilityDiv = document.createElement('div');
    availabilityDiv.id = 'availabilitystatus';
    availabilityDiv.setAttribute('availability', availabilityStatus);
    document.body.append(availabilityDiv);
  })
  const iframeSelector = `iframe[id*="videolist"]`
  addOptionalWait(iframeSelector);
  await context.evaluate(() => {
    const iframeElement = document.evaluate('//iframe[contains(@id,"videolist")]', document).iterateNext();
    const ifrmeDocument = iframeElement && iframeElement.contentDocument;
    const videoElement = ifrmeDocument && ifrmeDocument.querySelector('div[class*="video-item-tile"]');
    const videoId = videoElement && videoElement.getAttribute('data-videoid');
    if (videoId != null) {
      const videoUrl = `https://youtu.be/${videoId}`;
      const videoDiv = document.createElement('div');
      videoDiv.id = 'videoinformation';
      videoDiv.setAttribute('video', videoUrl);
      document.body.append(videoDiv);
    }
  })
  await context.evaluate(() => {
    let sku;
    const sku1 = document.evaluate('//div[contains(text(),"Valmistajan tuotenumero")]/../../td', document).iterateNext() && document.evaluate('//div[contains(text(),"Valmistajan tuotenumero")]/../../td', document).iterateNext().textContent;
    const sku2 = document.evaluate('//div[contains(text(),"Tuotenumero")]/../../td', document).iterateNext() && document.evaluate('//div[contains(text(),"Tuotenumero")]/../../td', document).iterateNext().textContent;
    if (sku2 !== null) {
      sku = sku2;
    } else {
      sku = sku1;
    }
    const apiArray = [];
    const colorArray = [];
    const colorButtons = document.querySelectorAll('div[class*="swatch-item-wrapper"]>div>div>div>button');
    [...colorButtons].forEach((element) => {
      apiArray.push(element.getAttribute('data-url'));
      colorArray.push(element.getAttribute('aria-describedby'));
    })
    async function callingApi(api) {
      let data = await fetch(api);
      let responseData = data && await data.json();
      return responseData;;
    }
    function getImageData(data) {
      const allImageArray = data.product.images.mainimage.map(element => element.url);
      const mainProductImage = allImageArray.slice(0, 1)[0];
      const secndaryImageArray = allImageArray.slice(1);
      const secondaryImages = secndaryImageArray.join(' | ');
      return {
        mainProductImage,
        secondaryImages
      }
    }
    function getVariantId(data) {
      let variantid = data && data.gtm && data.gtm.productData && data.gtm.productData.variantSKU;
      if (variantid === 'empty') {
        variantid = data && data.gtm && data.gtm.productData && data.gtm.productData.id;
      }
      return variantid;
    }
    apiArray.forEach(async (element, index) => {
      let data = await callingApi(apiArray[index]);
      let { mainProductImage, secondaryImages } = getImageData(data);
      let variantid = getVariantId(data);
      let variantelement = document.createElement('div');
      variantelement.setAttribute('mainimage', mainProductImage);
      variantelement.setAttribute('secondaryimage', secondaryImages);
      variantelement.setAttribute('color', colorArray[index])
      variantelement.setAttribute('variantid', variantid)
      variantelement.setAttribute('sku', sku)
      variantelement.className = "variantinformation";
      document.body.append(variantelement);
    })
    if (apiArray.length === 0) {
      const mainImage = document.evaluate('//div[contains(@class,"js-big-image big-image")][contains(@class,"active")]/div/img/@src', document).iterateNext() && document.evaluate('//div[contains(@class,"js-big-image big-image")][contains(@class,"active")]/div/img/@src', document).iterateNext().textContent;
      const secondaryImagesArray = [];
      const images = document.evaluate('//div[contains(@class,"js-thumbnail-wrapper")]/div[position()>1]/div/img/@src', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0; i < images.snapshotLength; i++) {
        secondaryImagesArray.push(images.snapshotItem(i).textContent)
      }
      const finalSecondaryImage = secondaryImagesArray.join(' | ');
      const url = window.location.href;
      const variantId = url.replace(/(.+\/)(\d+)(\-\d+|)(\.html)/g, '$2$3');
      const dafaultDiv = document.createElement('div');
      dafaultDiv.id = 'defaultdiv';
      dafaultDiv.setAttribute('variantid', variantId);
      dafaultDiv.setAttribute('sku', sku);
      dafaultDiv.setAttribute('secondaryimage', finalSecondaryImage);
      dafaultDiv.setAttribute('mainimage', mainImage);
      document.body.append(dafaultDiv);
    }
  })
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'stockmann',
    transform,
    domain: 'stockmann.com',
    zipcode: '',
  },
  implementation,
};
