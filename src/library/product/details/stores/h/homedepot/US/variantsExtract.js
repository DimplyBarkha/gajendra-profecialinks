
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async () => {
    async function getVariants () {
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
            // 'x-api-cookies': JSON.stringify(xAPICookies),
            'x-experience-name': window.experienceMetadata.name,
          },
          body: JSON.stringify(body),
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        });
        const data = await response.json();
        return data.data.product;
      }
      let baseData = window.__APOLLO_STATE__ && Object.values(window.__APOLLO_STATE__).find(elm => elm.__typename === 'BaseProduct' && elm.dataSources === 'catalog');
      // Sometimes __APOLLO_STATE__ may not have the data, we can get from API if needed, update the graphQL query if API is missing the particular property.
      baseData = baseData || await getBaseData();
      const parentId = baseData.identifiers.parentId;
      if (parentId) {
        const body = {
          operationName: 'metadata',
          variables: { parentId },
          query:
          'query metadata($parentId: String!) {\n  metadata(parentId: $parentId) {\n    attributes {\n      attributeValues {\n        value\n        swatchGuid\n        __typename\n      }\n      attributeName\n      isSwatch\n      __typename\n    }\n    childItemsLookup {\n      attributeCombination\n      canonicalUrl\n      isItemBackOrdered\n      itemId\n      __typename\n    }\n    sizeAndFitDetail {\n      attributeGroups {\n        attributes {\n          attributeName\n          dimensions\n          __typename\n        }\n        dimensionLabel\n        productType\n        __typename\n      }\n      __typename\n    }\n    superDuperSku {\n      attributes {\n        attributeName\n        attributeValues {\n          selected\n          superSkuUrl\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
        };
        const response = await fetch('https://www.homedepot.com/product-information/model', {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'sec-ch-ua':
              '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-debug': 'false',
            'x-experience-name': window.experienceMetadata.name,
          },
          body: JSON.stringify(body),
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        });
        const json = await response.json();
        const variants = (json.data.metadata && json.data.metadata.childItemsLookup.map(product => (window.location.origin + product.canonicalUrl))) || [];
        return variants;
      }
      return [];
    }
    const variantData = await getVariants();
    const currentPage = window.location.origin + window.location.pathname;
    variantData.push(currentPage);
    const uniqueVariants = Array.from(new Set(variantData));
    uniqueVariants.forEach(variant => {
      const a = document.createElement('a');
      a.setAttribute('src', variant);
      a.setAttribute('class', 'variants');
      a.id = variant.match(/[^\/]+$/)[0];
      document.body.append(a);
    });
  });
  return await context.extract(variants, { transform });
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    transform: null,
    domain: 'homedepot.com',
    zipcode: '30324',
  },
  implementation,
};
