async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const addOptionalWait = async (selector, wait) => {
    try {
      await context.waitForSelector(selector, { timeout: `${wait}` })
      console.log(`${selector}------------ loaded successfully`)
    } catch (e) {
      console.log(`${selector}--- not able to load the selector`);
    }
  }
  const getReferenceToElementByXpath = async (xpath) => {
    return await context.evaluate((xpath) => {
      return document.evaluate(xpath, document) && document.evaluate(xpath, document).iterateNext();
    }, xpath)
  }
  const getReferenceToElementBySelector = async (selector) => {
    return await context.evaluate((selector) => {
      return document.querySelector(selector);
    }, selector)
  }
  await context.evaluate(async () => {
    const scriptElement = document.querySelector('script[type*="application/ld+json"]');
    const jsonData = scriptElement && scriptElement.innerText && JSON.parse(scriptElement.innerText)
    const sku = jsonData && jsonData.sku;
    const name = jsonData && jsonData.name;
    const rating = jsonData && jsonData.aggregateRating && jsonData.aggregateRating.ratingValue;
    const reviews = jsonData && jsonData.aggregateRating && jsonData.aggregateRating.ratingCount;
    const brandName = jsonData && jsonData.brand;
    const manufacturer = jsonData && jsonData.manufacturer;
    const mpc = sku && sku.split('-') && sku.split('-')[0];
    const getListPrice = () => {
      const priceRow = document.querySelector('x-wrapper-re-1-3 > div > div');
      const priceElements = document.evaluate('.//span[text() and not(contains(text(), "VAT"))]', priceRow, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const price = priceElements.snapshotItem(0) ? priceElements.snapshotItem(0).textContent : '';
      const listPrice = priceElements.snapshotItem(1) ? priceElements.snapshotItem(1).textContent : '';
      return listPrice;
    }

    const getPrimaryImage = () => {
      const scriptElement = document.querySelector('script[type*="application/ld+json"]');
      const jsonData = scriptElement && scriptElement.innerText && JSON.parse(scriptElement.innerText);
      const imageArray = jsonData && jsonData.image;
      const primaryImage = imageArray && imageArray.slice(0, 1);
      const primaryImageWithIncreasedSize = primaryImage.map((element) => element && element.replace(/(.+)(\?)(imwidth=)(\d+)/g, '$1$2$31800'));
      return primaryImageWithIncreasedSize[0];
    }

    const getSecondaryImages = () => {
      const scriptElement = document.querySelector('script[type*="application/ld+json"]');
      const jsonData = scriptElement && scriptElement.innerText && JSON.parse(scriptElement.innerText);
      const imageArray = jsonData && jsonData.image;
      const secondaryImages = imageArray && imageArray.slice(1);
      const secondaryImagesWithIncreasedSize = secondaryImages.map((element) => element && element.replace(/(.+)(\?)(imwidth=)(\d+)/g, '$1$2$31800'));
      const secondaryImageJoinedByPipe = secondaryImagesWithIncreasedSize.map(element => element && element.trim()).join(' | ');
      return secondaryImageJoinedByPipe
    }
    const getTotalSecondaryImage = () => {
      const scriptElement = document.querySelector('script[type*="application/ld+json"]');
      const jsonData = scriptElement && scriptElement.innerText && JSON.parse(scriptElement.innerText);
      const imageArray = jsonData && jsonData.image;
      const secondaryImages = imageArray && imageArray.slice(1);
      return secondaryImages && secondaryImages.length;
    }

    const getVariantIDArray = () => {
      const scriptElement = document.querySelector('script[type*="application/ld+json"]');
      const jsonData = scriptElement && scriptElement.innerText && JSON.parse(scriptElement.innerText);
      const variantIdArray = jsonData && jsonData.offers && jsonData.offers.map(element => element.sku);
      return variantIdArray;
    }

    const getAvailabilityArray = () => {
      const scriptElement = document.querySelector('script[type*="application/ld+json"]');
      const jsonData = scriptElement && scriptElement.innerText && JSON.parse(scriptElement.innerText);
      const availabilityArray = [];
      jsonData && jsonData.offers && jsonData.offers.forEach((element) => {
        if (element.availability.includes('InStock')) {
          availabilityArray.push('In Stock');
        } else {
          availabilityArray.push('Out of Stock');
        }
      })
      return availabilityArray;
    }
    const getPriceArray = () => {
      const scriptElement = document.querySelector('script[type*="application/ld+json"]');
      const jsonData = scriptElement && scriptElement.innerText && JSON.parse(scriptElement.innerText);
      const priceArray = jsonData && jsonData.offers && jsonData.offers.map(element => element.price);
      return priceArray;
    }
    const clickElement = document.querySelector('button[id="picker-trigger"]>span')
    if (clickElement) {
      clickElement.click();
    }
    const getsizeArray = () => {
      const sizeArray = [];
      const sizeElements = document.querySelectorAll('form[name="size-picker-form"]>div>div>div>label>span>div>span:first-child');
      sizeElements && sizeElements.forEach(element => sizeArray.push(element.innerText));
      return sizeArray;
    }
    const getComapareVariantIdArray = () => {
      const compareVariantIdArray = document.querySelectorAll('form[name="size-picker-form"]>div>div>input');
      let idArray = [];
      idArray = [...compareVariantIdArray].map((element) => element.getAttribute('value'));
      return idArray;
    }
    const primaryImage = getPrimaryImage();
    const secondaryImages = getSecondaryImages();
    const totalSecondaryImages = getTotalSecondaryImage();
    const variantIdArray = getVariantIDArray();
    const availabilityArray = getAvailabilityArray();
    const priceArry = getPriceArray();
    const sizeArray = getsizeArray();
    const compareVariantArray = getComapareVariantIdArray();
    const listPrice = getListPrice();
    const actulaSizeArray = [];
    variantIdArray.forEach((element1, index1) => {
      compareVariantArray.forEach((element2, index2) => {
        if (element1 === element2) {
          actulaSizeArray.push(sizeArray[index2]);
        }
      })
    })
    //code for appending the elements to document
    variantIdArray.forEach((element, index) => {
      const productInfoElement = document.createElement('div');
      productInfoElement.className = 'productinformation';
      productInfoElement.style.display = 'none';
      productInfoElement.setAttribute('sku', sku);
      productInfoElement.setAttribute('productname', name);
      productInfoElement.setAttribute('productrating', rating);
      productInfoElement.setAttribute('productreviews', reviews);
      productInfoElement.setAttribute('brandname', brandName);
      productInfoElement.setAttribute('manufacturer', manufacturer);
      productInfoElement.setAttribute('mpc', mpc);
      productInfoElement.setAttribute('productmainimage', primaryImage);
      productInfoElement.setAttribute('productsecondaryimages', secondaryImages);
      productInfoElement.setAttribute('availabilitystatus', availabilityArray[index]);
      productInfoElement.setAttribute('variantid', variantIdArray[index]);
      productInfoElement.setAttribute('price', priceArry[index]);
      productInfoElement.setAttribute('productsize', actulaSizeArray[index]);
      productInfoElement.setAttribute('totalsecondaryimages', totalSecondaryImages);
      productInfoElement.setAttribute('listprice', listPrice);
      document.body.append(productInfoElement);
    })
  });
  // const sizePickerClickElementXpath = `//button[@id="picker-trigger"]/span`;
  // const sizePickerClickElement = await getReferenceToElementByXpath(sizePickerClickElementXpath);
  // if (sizePickerClickElement) {
  //   // await context.click(sizePickerClickElement);
  //   sizePickerClickElement.click();
  // }
  return await context.extract(productDetails, { transform });
}
const { cleanUp } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'zalando',
    transform: cleanUp,
    domain: 'zalando.it',
    zipcode: '',
  },
  implementation,
};
