const { transform } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addElementToDocument (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    function getElementByXpath (path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    // This is for description
    new Promise(r => setTimeout(r, 5000));
    // const description =(document.querySelector('.desktop-content-wrapper__main-description').textContent).split(/[\n]/).join('||');
    // const description =document.querySelector('.desktop-content-wrapper__main-description > div.bullet-list-wrapper > ul > li').textContent
    const description = getElementByXpath('//div[@class="grid desktop-content-wrapper__main-description"]/text()');
    // const description = document.querySelector('.desktop-content-wrapper__main-description').textContent
    console.log('new Des : ', description);
    var specification = [];
    if (document.querySelectorAll('div[class="grid desktop-content-wrapper__main-description"] > div[class="bullet-list-wrapper"]>ul>li') != null && document.querySelectorAll('div[class="grid desktop-content-wrapper__main-description"] > div[class="bullet-list-wrapper"]>ul>li') != undefined) {
      document.querySelectorAll('div[class="grid desktop-content-wrapper__main-description"] > div[class="bullet-list-wrapper"]>ul>li').forEach(e => {
        specification.push(e.innerText);
      });
      console.log(specification.join(' || '), '##########');
      // console.log("New Description : ",(description.textContent+' || '+specification.join(' || ')))
    }
    if (description != null && description != undefined) {
      addElementToDocument('description', (description.textContent + ' || ' + specification.join(' || ')));
    }
    // This is for descriptionBullets
    if (specification != null && specification != undefined) {
      var descriptionBulletsCount = specification.length;
      addElementToDocument('descriptionBullets', descriptionBulletsCount);
    }
    // This end of descriptionBullets

    // This is for PackSize

    const numPack4 = getElementByXpath('//div[@class="grid"]//div[@class="specifications__wrapper"]/div/div[contains(text(), "Number in")]/following-sibling::*[1]');
    const numPack2 = getElementByXpath('//div[@class="grid"]//div[@class="specifications__wrapper"]/div/div[contains(text(), "Package Quantity")]/following-sibling::*[1]');
    const numPack3 = getElementByXpath('//div[@class="grid"]//div[@class="specifications__wrapper"]/div/div[contains(text(), "Number of")]/following-sibling::*[1]');
    const numPack5 = getElementByXpath('//*[@id="specsContainer"]/div/div/div[contains(text(),"Number Of")]/following-sibling::*[1]');
    const numPack1 = getElementByXpath('//div[@class="grid"]//div[@class="specifications__wrapper"]/div/div[contains(text(), "Pack Size")]/following-sibling::*[1]');

    // console.log(typeof(numPack1.textContent))
    if (numPack1 != null && numPack1 != undefined) {
      addElementToDocument('packSize', numPack1.textContent);
    } else if (numPack2 != null && numPack2 != undefined) {
      addElementToDocument('packSize', numPack2.textContent);
    } else if (numPack3 != null && numPack3 != undefined) {
      addElementToDocument('packSize', numPack3.textContent);
    } else if (numPack4 != null && numPack4 != undefined) {
      addElementToDocument('packSize', numPack4.textContent);
    } else if (numPack5 != null && numPack5 != undefined) {
      addElementToDocument('packSize', numPack5.textContent);
    }

    // This is for SKU

    const siteSKU = getElementByXpath('//div/div[3]/div/div/div[2]/div/div[1]/div/div/h2[starts-with(@class,"product")][contains(text(),"Store SO SKU")]/text()[2] | //*[@id="mediaPlayerContainer"]/div/div[1]/h2[starts-with(@class,"product")][contains(text(),"Store SO SKU")]/span/text()');
    if (siteSKU != null && siteSKU != undefined) {
      console.log(siteSKU);
      console.log('Hello4');
      addElementToDocument('sku', siteSKU.textContent);
    } else {
      console.log('Not found on site');
      // const scriptSKU = getElementByXpath('//script[contains(text(), "gtin13")]/text()')
      console.log('Hello5');
      if (document.querySelector('script[type="application/ld+json"]')) {
        var data = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].innerText);
        console.log('Hello6');
        var sku = '';
        if (data != null && data != undefined) {
          sku = data.sku;
          console.log('Hello7');
          addElementToDocument('sku', sku);
        }
      } else {
        const newSiteSKU = getElementByXpath('//h2[starts-with(@class,"product")][contains(text(),"Store SKU")]/span/text()');
        if (newSiteSKU != null && newSiteSKU != undefined) {
          console.log(newSiteSKU);
          addElementToDocument('sku', newSiteSKU.textContent);
        }
      }
    }

    if (document.querySelector('html>head>script[type="application/ld+json"]')) {
      var priceJson = JSON.parse(document.querySelector('html > head > script[type="application/ld+json"]').innerText);
      console.log('This is for price check : ');
      console.log('This is for price check : ', priceJson.offers);
      console.log('This is for price check : 2');
      var actualPrice = '';
      // var productBrand = "";
      if (priceJson.offers != null && priceJson.offers != undefined) {
        actualPrice = priceJson.offers.price;
      }
      if (priceJson.brand != null && priceJson.brand != undefined) {
        var productBrand = priceJson.brand.name;
        addElementToDocument('brand', productBrand);
      }

      var productName = priceJson.name;
      var color = priceJson.color;
      addElementToDocument('color', color);

      console.log(actualPrice, 'price');
      console.log(productBrand, 'brand');
      console.log(productName, 'name');
    }
    // var priceDetails = priceJson.match(/(price":)([^,]+)/);
    // var priceIndex = priceDetails[2];
    if (document.querySelector('span[itemprop="price"]')) {
      var priceContent = document.querySelector('span[itemprop="price"]');
      var mainPrice = priceContent.getAttribute('content');
    }
    if (document.querySelector('html > head > script[type="application/ld+json"]')) addElementToDocument('price', actualPrice);
    addElementToDocument('price', mainPrice);
    // if(JSON.parse(document.querySelector('html > head > script[type="application/ld+json"]').innerText).offers.price) addElementToDocument('price',actualPrice );

    if (getElementByXpath('//h2[@itemprop="brand"]//span')) {
      var brandSpan = getElementByXpath('//h2[@itemprop="brand"]//span').textContent;
      addElementToDocument('brand', brandSpan);
    }
    if (document.querySelector('h1.product-title__title')) {
      var nameSpan = document.querySelector('h1.product-title__title').innerText;
    }
    if (getElementByXpath('//div[@itemprop="color"]')) {
      var colorSpan = getElementByXpath('//div[@itemprop="color"]').textContent;
      addElementToDocument('color', colorSpan);
    }
    var extendedName = productName;
    // var NameExtendeds ;
    if (document.querySelector('html > head > script[type="application/ld+json"]')) {
      if (productBrand != undefined && productBrand != null) {
        extendedName = productBrand.concat(' - ' + productName);
        console.log('hi1');
      }
      if (color != undefined && color != null && color != '') {
        extendedName = extendedName.concat(' - ' + color);
        console.log('hi2 : ', color);
      }
      console.log(extendedName, 'extendedName');
    } else {
      extendedName = nameSpan;
      if (brandSpan != undefined && nameSpan != null) {
        extendedName = brandSpan.concat(' - ' + nameSpan);
        console.log('hi3');
      }
      if (colorSpan != undefined && colorSpan != null && colorSpan != '') {
        extendedName = extendedName.concat(' - ' + colorSpan);
        console.log('hi4');
      }
    }
    addElementToDocument('extendedName', extendedName);
  });
  /* We have pretty much all the data in an object, below code might should probably be implemented
     properly to get all values from the object. API is also available. */
  await context.evaluate(async () => {
    function addDynamicTable (jsonData, tableID) {
      function generateDynamicTable (jsonData) {
        const dataLength = jsonData.length;

        jsonData = jsonData.map((elm) => {
          if (typeof elm !== 'object') {
            return { item: elm };
          }
          return elm;
        });
        if (dataLength > 0) {
          const table = document.createElement('table');
          table.style.width = '100%';
          table.setAttribute('border', '1');
          table.setAttribute('cellspacing', '0');
          table.setAttribute('cellpadding', '5');

          const col = [];
          for (let i = 0; i < dataLength; i++) {
            for (const key in jsonData[i]) {
              if (col.indexOf(key) === -1) {
                col.push(key);
              }
            }
          }
          const tHead = document.createElement('thead');
          tHead.setAttribute('bgcolor', '#CCC4F5');
          tHead.style.color = 'black';
          const hRow = document.createElement('tr');

          for (let i = 0; i < col.length; i++) {
            const th = document.createElement('th');
            th.innerHTML = col[i];
            hRow.appendChild(th);
          }
          tHead.appendChild(hRow);
          table.appendChild(tHead);

          const tBody = document.createElement('tbody');

          for (let i = 0; i < dataLength; i++) {
            const bRow = document.createElement('tr');
            for (let j = 0; j < col.length; j++) {
              const td = document.createElement('td');
              table.style.padding = '5px';
              table.style.margin = '5px auto';
              td.setAttribute('class', col[j]);
              if (
                jsonData[i][col[j]] &&
              (jsonData[i][col[j]] !== 'null' ||
                jsonData[i][col[j]] !== 'undefined')
              ) {
                if (typeof jsonData[i][col[j]] === 'object') {
                  if (Array.isArray(jsonData[i][col[j]])) {
                    const table = generateDynamicTable(jsonData[i][col[j]]);
                    table && td.append(table);
                  } else {
                    const table = generateDynamicTable([jsonData[i][col[j]]]);
                    table && td.append(table);
                  }
                } else {
                  td.innerHTML = jsonData[i][col[j]];
                }
              }
              bRow.appendChild(td);
              bRow.style.padding = '5px';
            }
            tBody.appendChild(bRow);
          }
          table.appendChild(tBody);
          return table;
        }
      }
      const table = generateDynamicTable(jsonData);
      const container = document.createElement('div');
      container.setAttribute('id', tableID);
      container.setAttribute('style', 'overflow:auto');
      container.innerHTML = '';
      container.appendChild(table);
      return container;
    }
    async function getBaseData () {
      const body = {
        operationName: 'productClientOnlyProduct',
        variables: {
          skipSpecificationGroup: false,
          itemId: window.location.pathname.match(/[^\/]+$/)[0],
          storeId: '8199', // Using default
          zipCode: '30324', // Using default
        },
        query: 'query productClientOnlyProduct($storeId: String, $zipCode: String, $itemId: String!, $dataSource: String, $skipSpecificationGroup: Boolean = false) {\n  product(itemId: $itemId, dataSource: $dataSource) {\n    fulfillment(storeId: $storeId, zipCode: $zipCode) {\n      backordered\n      fulfillmentOptions {\n        type\n        fulfillable\n        services {\n          type\n          locations {\n            isAnchor\n            inventory {\n              isLimitedQuantity\n              isOutOfStock\n              isInStock\n              quantity\n              isUnavailable\n              maxAllowedBopisQty\n              minAllowedBopisQty\n              __typename\n            }\n            type\n            storeName\n            locationId\n            curbsidePickupFlag\n            isBuyInStoreCheckNearBy\n            distance\n            state\n            storePhone\n            __typename\n          }\n          deliveryTimeline\n          deliveryDates {\n            startDate\n            endDate\n            __typename\n          }\n          deliveryCharge\n          dynamicEta {\n            hours\n            minutes\n            __typename\n          }\n          hasFreeShipping\n          freeDeliveryThreshold\n          totalCharge\n          __typename\n        }\n        __typename\n      }\n      anchorStoreStatus\n      anchorStoreStatusType\n      backorderedShipDate\n      bossExcludedShipStates\n      excludedShipStates\n      seasonStatusEligible\n      onlineStoreStatus\n      onlineStoreStatusType\n      inStoreAssemblyEligible\n      __typename\n    }\n    itemId\n    dataSources\n    identifiers {\n      canonicalUrl\n      brandName\n      itemId\n      modelNumber\n      productLabel\n      storeSkuNumber\n      upcGtin13\n      specialOrderSku\n      toolRentalSkuNumber\n      rentalCategory\n      rentalSubCategory\n      upc\n      isSuperSku\n      parentId\n      productType\n      sampleId\n      __typename\n    }\n    availabilityType {\n      discontinued\n      status\n      type\n      buyable\n      __typename\n    }\n    details {\n      description\n      collection {\n        url\n        collectionId\n        __typename\n      }\n      highlights\n      __typename\n    }\n    media {\n      images {\n        url\n        sizes\n        type\n        subType\n        __typename\n      }\n      video {\n        shortDescription\n        thumbnail\n        url\n        videoStill\n        link {\n          text\n          url\n          __typename\n        }\n        title\n        type\n        videoId\n        longDescription\n        __typename\n      }\n      threeSixty {\n        id\n        url\n        __typename\n      }\n      augmentedRealityLink {\n        usdz\n        image\n        __typename\n      }\n      richContent {\n        content\n        __typename\n      }\n      __typename\n    }\n    pricing(storeId: $storeId) {\n      promotion {\n        dates {\n          end\n          start\n          __typename\n        }\n        type\n        description {\n          shortDesc\n          longDesc\n          __typename\n        }\n        dollarOff\n        percentageOff\n        savingsCenter\n        savingsCenterPromos\n        specialBuySavings\n        specialBuyDollarOff\n        specialBuyPercentageOff\n        experienceTag\n        subExperienceTag\n        anchorItemList\n        itemList\n        reward {\n          tiers {\n            minPurchaseAmount\n            minPurchaseQuantity\n            rewardPercent\n            rewardAmountPerOrder\n            rewardAmountPerItem\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      value\n      alternatePriceDisplay\n      alternate {\n        bulk {\n          pricePerUnit\n          thresholdQuantity\n          value\n          __typename\n        }\n        unit {\n          caseUnitOfMeasure\n          unitsOriginalPrice\n          unitsPerCase\n          value\n          __typename\n        }\n        __typename\n      }\n      original\n      mapAboveOriginalPrice\n      message\n      specialBuy\n      unitOfMeasure\n      __typename\n    }\n    reviews {\n      ratingsReviews {\n        averageRating\n        totalReviews\n        __typename\n      }\n      __typename\n    }\n    seoDescription\n    specificationGroup @skip(if: $skipSpecificationGroup) {\n      specifications {\n        specName\n        specValue\n        __typename\n      }\n      specTitle\n      __typename\n    }\n    taxonomy {\n      breadCrumbs {\n        label\n        url\n        browseUrl\n        creativeIconUrl\n        deselectUrl\n        dimensionName\n        refinementKey\n        __typename\n      }\n      brandLinkUrl\n      __typename\n    }\n    favoriteDetail {\n      count\n      __typename\n    }\n    info {\n      hidePrice\n      ecoRebate\n      quantityLimit\n      sskMin\n      sskMax\n      unitOfMeasureCoverage\n      wasMaxPriceRange\n      wasMinPriceRange\n      fiscalYear\n      productDepartment\n      classNumber\n      forProfessionalUseOnly\n      globalCustomConfigurator {\n        customButtonText\n        customDescription\n        customExperience\n        customExperienceUrl\n        customTitle\n        __typename\n      }\n      movingCalculatorEligible\n      label\n      recommendationFlags {\n        visualNavigation\n        __typename\n      }\n      replacementOMSID\n      hasSubscription\n      minimumOrderQuantity\n      projectCalculatorEligible\n      subClassNumber\n      calculatorType\n      isLiveGoodsProduct\n      protectionPlanSku\n      hasServiceAddOns\n      consultationType\n      __typename\n    }\n    sizeAndFitDetail {\n      attributeGroups {\n        attributes {\n          attributeName\n          dimensions\n          __typename\n        }\n        dimensionLabel\n        productType\n        __typename\n      }\n      __typename\n    }\n    keyProductFeatures {\n      keyProductFeaturesItems {\n        features {\n          name\n          refinementId\n          refinementUrl\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    badges(storeId: $storeId) {\n      color\n      creativeImageUrl\n      endDate\n      label\n      message\n      name\n      timerDuration\n      __typename\n    }\n    installServices {\n      scheduleAMeasure\n      __typename\n    }\n    subscription {\n      defaultfrequency\n      discountPercentage\n      subscriptionEnabled\n      __typename\n    }\n    __typename\n  }\n}',
      };
      const ttSearch = (document.cookie.match(/x-ttsearch=([^;]+)/) && document.cookie.match(/x-ttsearch=([^;]+)/)[1]) || 'nlpservices_a';
      const userId = (document.cookie.match(/thda\.u=([^;]+)/) && document.cookie.match(/thda\.u=([^;]+)/)[1]) || '99280152-9f3b-0011-30ab-a261eb602ebc';
      // const xAPICookies = { tt_search: document.cookie.match(/x-ttsearch=([^;]+)/)[1], 'x-user-id': document.cookie.match(/thda\.u=([^;]+)/)[1] };
      const xAPICookies = { tt_search: ttSearch, 'x-user-id': userId };
      const response = await fetch('https://www.homedepot.com/product-information/model', {
        headers: {
          'content-type': 'application/json',
          'x-api-cookies': JSON.stringify(xAPICookies),
          'x-experience-name': 'general-merchandise',
        },
        body: JSON.stringify(body),
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      });
      const data = await response.json();
      return data.data.product;
    }
    let baseData = window.__APOLLO_STATE__ && Object.values(window.__APOLLO_STATE__).find(elm => elm.__typename === 'BaseProduct' && elm.itemId === window.location.pathname.match(/[^\/]+$/)[0]);
    baseData = baseData || await getBaseData();
    try {
      if (baseData.media && baseData.media.richContent) {
        const richContentTable = addDynamicTable([JSON.parse(baseData.media.richContent.content)]);
        const manufacturerDescription = [...richContentTable.querySelectorAll('.text')].map(elm => elm.innerText).filter(elm => elm.trim()).join(' ');
        const manufacturerImages = [...richContentTable.querySelectorAll('.imageSrc .desktop')].map(elm => elm.innerText).filter(elm => elm.trim()).join('|');
        document.body.setAttribute('manufacturerDescription', manufacturerDescription);
        document.body.setAttribute('manufacturerImages', manufacturerImages);
      }
    } catch (error) {
      console.log('Error adding RichContent Data. Error: ', error);
    }
    const videos = baseData && baseData.media && baseData.media.video && baseData.media.video.map(elm => elm.url).join('|');
    document.body.setAttribute('videos', videos);
    try {
      const promotion = Object.values(baseData).find(elm => elm.promotion).promotion.description.longDesc || Object.values(baseData).find(elm => elm.promotion).promotion.description.shortDesc;
      document.body.setAttribute('promotion', promotion);
    } catch (error) {
      console.log('Error adding promotion text. Error: ', error);
    }
    try {
      const secondaryImages = baseData.media.images.filter(image => !(image.subType === 'PRIMARY')).map(image => {
        return image.url.replace('<SIZE>', image.sizes.pop());
      }).join('|');
      document.body.setAttribute('secondaryImages', secondaryImages);
    } catch (error) {
      console.log('Error adding secondaryImages. Error: ', error);
    }
    const image360 = Boolean(baseData && baseData.media && baseData.media.threeSixty);
    image360 && document.body.setAttribute('image360', image360.toString());
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    transform,
    domain: 'homedepot.com',
    zipcode: "''",
  },
  implementation,
};
