const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    transform: cleanUp,
    domain: 'coolblue.be',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const doesPopupExist = await context.evaluate(function () {
      return Boolean(document.querySelector('div.cookie button[name="accept_cookie"]'));
    });
    if (doesPopupExist) {
      await context.click('div.cookie button[name="accept_cookie"]');
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      };

      // Method to Retrieve Xpath content of a Single Node
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      // XPATH Data Extraction For Warranty
      const warrantyNodes = getAllXpath("//dl[@data-property-name='Warranty']//dd/text() | //dl[@data-property-name='Warranty type']//dd/text() | //dl[@data-property-name='Garantie']//dd/text() | //dl[@data-property-name='Garantietype']//dd/text()", 'nodeValue');
      addElementToDocument('addedWarranty', warrantyNodes);

      // @ts-ignore
      var availabilityStatus = window.dataLayer[0].google_tag_params.ecomm_availability;
      var availabilityStatusValue = 'Out of Stock';
      if (availabilityStatus === 'on-stock') {
        availabilityStatusValue = 'In Stock';
      }
      addElementToDocument('addedAvailability', availabilityStatusValue);
      // getXpath('//script[@type="application/ld+json"][contains(text(),"http://schema.org/InStock")]', 'nodeValue');
      // console.log('availabilityStatus');
      // console.log(availabilityStatus);
      // var availabilityStatus = Boolean(document.querySelector('div.product-order form button.button--order'));
      // var availabilityStatusValue = 'Out of Stock';
      // if (availabilityStatus) {
      //   availabilityStatusValue = 'In stock';
      // }
      // addElementToDocument('addedAvailability', availabilityStatusValue);

      // availabilityText = (availabilityText === 'temporary-out-of-stock') ? 'Out of Stock' : 'In stock';
      // addElementToDocument('addedAvailability', availabilityText);

      let onlinePriceScript;
      // @ts-ignore
      if ((window.dataLayer[0].google_tag_params.ecomm_availability === 'temporary-out-of-stock' || window.dataLayer[0].google_tag_params.ecomm_availability === 'on-stock') && (window.dataLayer[0].google_tag_params.ecomm_pvalue !== undefined || window.dataLayer[0].google_tag_params.ecomm_pvalue != null)) {
        // @ts-ignore
        onlinePriceScript = 'EUR ' + window.dataLayer[0].google_tag_params.ecomm_pvalue;
        addElementToDocument('addedOnlinePrice', onlinePriceScript.replace(/\./g, ','));
      } else {
        let onlinePrice = getXpath("//div[contains(@class,'product-order')][1]//div[contains(@class,'js-desktop-order-block')]//span[contains(@class,'sales-price')]//*[contains(@class,'sales-price__current')]/text()", 'nodeValue');
        if (onlinePrice != null) {
          onlinePrice = 'EUR ' + onlinePrice;
          addElementToDocument('addedOnlinePrice', onlinePrice);
        }
      }

      const productDescription = getXpath("//div[@id='product-content']//h1/text()[normalize-space(.)] | //h1//span/text()[normalize-space(.)] | //h1/text()[normalize-space(.)]", 'nodeValue');
      let prodDesc = '';
      let variantInformation = '';
      if (productDescription != null) {
        const productDropdownVariant = getXpath("//div[contains(@class,'collection-entrance__wrapper')]//span[@class='overflow--ellipsis']/text()", 'nodeValue');
        const productSelectionVariant = getXpath("//*[@class='color--additional']/text()[contains(.,'Variant')]//following::text()[1][normalize-space(.)]", 'nodeValue');
        var productSelectionSubVariant = getAllXpath("//*[@class='color--additional']/text()[contains(.,'Variant')]//following::span[@class='color--separator']//following::text()[1][normalize-space(.)]", 'nodeValue');
        var subVariant = '';
        if (productSelectionSubVariant != null) {
          subVariant = productSelectionSubVariant.join(' | ');
        }
        if (productDropdownVariant != null && productSelectionVariant != null) {
          console.log('1');
          prodDesc = productDescription + ' - ' + productDropdownVariant + ' - ' + productSelectionVariant.replace(/:/g, '').trim();
          variantInformation = productDropdownVariant + ' - ' + productSelectionVariant.replace(/:/g, '').trim();
          if (subVariant !== '') {
            prodDesc = prodDesc + ' | ' + subVariant;
            variantInformation = variantInformation + ' | ' + subVariant;
          }
        } else if (productDropdownVariant != null && productSelectionVariant === null) {
          console.log('2');
          prodDesc = productDescription + ' - ' + productDropdownVariant;
          variantInformation = productDropdownVariant;
        } else if (productSelectionVariant != null && productDropdownVariant === null) {
          prodDesc = productDescription + ' - ' + productSelectionVariant.replace(/:/g, '').trim();
          variantInformation = productSelectionVariant.replace(/:/g, '').trim();
          if (subVariant !== '') {
            prodDesc = prodDesc + ' | ' + subVariant;
            variantInformation = variantInformation + ' | ' + subVariant;
          }
        } else {
          prodDesc = productDescription;
        }

        // if (productSelectionVariant != null) {
        //   prodDesc = productDescription + ' - ' + productSelectionVariant.replace(/:/g, '').trim();
        // }
        addElementToDocument('addedProdDesc', prodDesc);
        addElementToDocument('addedvariantInformation', variantInformation);
      }
      const reviewNodeContent = getXpath("//div[contains(@class,'product-page--title-links')]//div[contains(@class,'review-rating')]//span[contains(@class,'review-rating__reviews')]//a/text() | //div[@id='product-content']//div[contains(@class,'review-rating')]//span[contains(@class,'review-rating__reviews')]//a/text() | //main[@id='main-content']//div[contains(@class,'review-rating')]//span[contains(@class,'review-rating__reviews')]//a/text()", 'nodeValue');
      if (reviewNodeContent != null) {
        var reviewContent = reviewNodeContent.substr((reviewNodeContent.indexOf('(') + 1), reviewNodeContent.length);
        reviewContent = reviewContent.replace(/[^0-9]/g, '');
        addElementToDocument('addedReviewCount', reviewContent);
      }

      const packSize = getXpath("//h1/text()[contains(.,'pack')] | //h1//span/text()[normalize-space(.)]", 'nodeValue');
      if (packSize != null) {
        const packText = packSize.split('-');
        console.log(packText);
        addElementToDocument('addedPackSize', packText[packText.length - 1]);
      }
      const ratingNodeContent = getXpath("//div[contains(@class,'product-page--title-links')]//div[contains(@class,'review-rating')]//div[@class='review-rating__icons']/@title | //div[@id='product-content']//div[contains(@class,'review-rating')]//div[@class='review-rating__icons']/@title | //main[@id='main-content']//div[contains(@class,'review-rating')]//div[@class='review-rating__icons']/@title", 'nodeValue');
      // @ts-ignore
      if (ratingNodeContent != null) {
        var ratingContent = ratingNodeContent.substr(0, ratingNodeContent.indexOf('van'));
        ratingContent = ratingContent.replace(/[^0-9.]/g, '');
        if (ratingContent) {
          addElementToDocument('addedRatingCount', ratingContent.replace('.', ','));
        }
      }

      const specificationsList = getAllXpath("//div[contains(@class,'js-specifications-content')]//h3/text() | //div[contains(@class,'js-specifications-content')]//div[contains(@class,'product-specs')]//dt/text()[normalize-space(.)] | //div[contains(@class,'js-specifications-content')]//div[contains(@class,'product-specs')]//dt//span[contains(@class,'product-specs__help-title')]/text()[normalize-space(.)] | //div[contains(@class,'js-specifications-content')]//div[contains(@class,'product-specs')]//dd/text()[normalize-space(.)] | //div[contains(@class,'js-specifications-content')]//div[contains(@class,'product-specs')]//dd//span[@class='screen-reader-only']/text()[normalize-space(.)]", 'nodeValue');
      if (specificationsList !== null && specificationsList.length > 0) {
        addElementToDocument('addedSpecification', specificationsList.join(' || '));
      }

      const additionalDescriptionBulletInfo = getAllXpath("//section[@id='product-information']//ul[@class='list']//li//div[@class='icon-with-text__text']/text()", 'nodeValue');
      if (additionalDescriptionBulletInfo !== null && additionalDescriptionBulletInfo.length > 0) {
        addElementToDocument('additionalDescriptionBulletInfo', additionalDescriptionBulletInfo.join(' || '));
      }

      const additionalDescription = getAllXpath("//div[@id='product-information']//div[contains(@class,'cms-content')][position() < 2]//text()[normalize-space(.)] | //section[@id='product-information']//div[contains(@class,'cms-content')][position() < 2]//text()[normalize-space(.)]", 'nodeValue');
      if (additionalDescription !== null && additionalDescription.length > 0) {
        const finalContent = (additionalDescriptionBulletInfo != null) ? additionalDescriptionBulletInfo.join(' || ') + ' | ' + additionalDescription.join(' | ') : additionalDescription.join(' | ');
        addElementToDocument('addedAdditionalDescription', finalContent);
      }

      const enhancedContent = getAllXpath("//div[@id='product-information']//div[contains(@class,'cms-content')][position() < 2]//text()[normalize-space(.)] | //section[@id='product-information']//div[contains(@class,'cms-content')][position() < 2]//text()[normalize-space(.)]", 'nodeValue');
      if (enhancedContent !== null && enhancedContent.length > 0) {
        addElementToDocument('addedEnhancedContent', enhancedContent);
      }

      const videos = getAllXpath("//section[@id='product-information']//div[contains(@class,'cms-content') and contains(@class,'hide-until-m')]//iframe/@src | //div[@id='layout_content']//ul[contains(@class,'product-media-gallery__wrapper')]//li[contains(@class,'js-product-page-video-link')]/@data-video", 'nodeValue');
      if (videos !== null && videos.length > 0) {
        addElementToDocument('addedVideos', videos.join(' || '));
      }
      const technicalDocument = getXpath("//div[@class='js-product-in-the-box-container']//ul[contains(@class,'bullet-list')]//li[1]//a[contains(@href,'manuals')]/@href", 'nodeValue');
      console.log(technicalDocument);
      var technicalDocumentStatus = (technicalDocument != null) ? 'Yes' : 'No';
      addElementToDocument('addedTechnicalDocument', technicalDocumentStatus);

      // var variantInfo = getAllXpath("//div[contains(@class,'product-order')]//div[contains(@class,'collection-entrance__dropdown')]//div[contains(@class,'selectable-card--emphasised')]//label/@for", 'nodeValue');
      // // @ts-ignore
      // variantInfo.forEach(function (item, index) {
      //   var filteredText = item.replace(/[^0-9.]/g, '');
      //   variantInfo[index] = filteredText.substr(0, 6);
      // });
      // var variantsList = variantInfo.join('|');
      // addElementToDocument('addedVariantInfo', variantsList);

      const imageListObject = getXpath('//div[contains(@class,"product-media-gallery") and contains(@class,"js-media-gallery")]/@data-component', 'nodeValue');
      if (imageListObject != null) {
        var imageList = JSON.parse(imageListObject);
        var imageArray = [];
        var imageObject = imageList[3].options.thumbnails;
        for (let i = 1; i < imageObject.length; i++) {
          if (imageObject[i].image_url.includes('/75x75/products/')) {
            imageArray.push(imageObject[i].image_url.replace(/75x75\/products/g, 'max/500x500/products'));
          }
        }
        addElementToDocument('addedSecondaryImageUrl', imageArray.join(' | '));
        addElementToDocument('addedSecondaryImageCount', imageArray.length);
      }

      const variantObjectInfo = getXpath("//div[@class='product-order']//div[contains(@data-component,'\"name\":\"trackEventImmediate\"')]/@data-component | //div[@class='product-order']//span[contains(@data-component,'\"name\":\"trackEventImmediate\"')]/@data-component", 'nodeValue');

      if (variantObjectInfo != null) {
        const variantObject = JSON.parse(variantObjectInfo);
        const variantsDetails = (variantObject[0].options.ga.label).split('|');
        const variants = variantsDetails[1].split(',');
        addElementToDocument('addedVariantCount', variants.length);
        addElementToDocument('addedFirstVariant', variants[0]);
        addElementToDocument('addedVariants', variants.join(' | '));
      } else {
        addElementToDocument('addedVariantCount', 0);
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
