
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'us',
    store: 'walgreens',
    transform: null,
    domain: 'walgreens.com',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ url, id }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(([{ id: _input }, _url]) => {
      const addElementToDocument = (key, value, { parentID = '', type = 'span' } = {}) => {
        const htmlString = `<${type} style="display:none" id="added_${key}" ></${type}>`;
        const root = parentID ? document.querySelector(parentID) : document.body;
        root.insertAdjacentHTML('beforeend', htmlString);
        if (Array.isArray(value)) {
          const innerHTML = value.reduce((acc, val) => {
            return `${acc}<li>${val}</li>`;
          }, '<ul>') + '</ul>';
          document.querySelector(`#added_${key}`).innerHTML = innerHTML;
        } else {
          document.querySelector(`#added_${key}`).innerHTML = value;
          document.querySelector(`#added_${key}`).textContent = document.querySelector(`#added_${key}`).innerText;
        }
      };
      const addObjectToDocument = (obj) => {
        Object.entries(obj).forEach(([key, value]) => value ? addElementToDocument(key, value) : '');
      };
      const getSelector = (selector, { property = 'textContent', doc = document, raw = false, ifError = '' } = {}) => {
        const text = doc.querySelector(selector) ? doc.querySelector(selector)[property] : ifError;
        return raw ? text : text.replace(/\s{2,}, ' '/g).replace(/^\s*\n|^.\n/gm, '').trim();
      };

      const jsonObj = window.__ATC_APP_INITIAL_STATE__.product.results;

      const infos = jsonObj.productInfo;
      const details = jsonObj.prodDetails;
      const price = jsonObj.priceInfo;

      const priceOther = JSON.parse(getSelector('script[type="application/ld+json"]', { raw: true, ifError: JSON.stringify({}) }));

      const priceValue = (props) => {
        if (!Array.isArray(props)) return priceValue([props]);
        const result = props.reduce((acc, prop) => {
          if (!price[prop]) return acc;
          return (price[prop].split('$').length > 2
            ? (priceOther.offers ? priceOther.offers.price : '')
            : price[prop]);
        }, '');
        if (!result) return '';
        return result.includes('$') ? result : `$${result}`;
      };

      const findInSection = key => (details.section.find(u => u[key]) ? details.section.find(u => u[key])[key] : '');

      const desc = findInSection('description');
      const ingredients = findInSection('ingredients');
      const warnings = findInSection('warnings');
      const shipping = findInSection('shipping');
      const reviews = findInSection('reviews');

      const fullDescription = desc ? decodeURIComponent(desc.productDesc) : '';
      const directions = fullDescription.toLowerCase().indexOf('how to') > -1 ? fullDescription.toLowerCase().indexOf('how to') : '';

      const images = infos.filmStripUrl.reduce((acc, obj) => {
        const filtered = Object.entries(obj).filter(([key]) => key.includes('largeImageUrl'));
        const array = filtered.length === 0 ? ['https:' + Object.entries(obj)[0]] : filtered.map(([key, link]) => 'https:' + link);
        return [...acc, ...array];
      }, []);

      const hasIngrList = ingredients && ingredients.ingredientGroups &&
        ingredients.ingredientGroups.find(u => u.ingredientTypes) &&
        ingredients.ingredientGroups.find(u => u.ingredientTypes).ingredientTypes.find(u => u.ingredients);
      const ingrList = hasIngrList ? ingredients.ingredientGroups.find(u => u.ingredientTypes).ingredientTypes.reduce((acc, obj) => [...acc, ...obj.ingredients], []) : '';

      const nutrition = ingredients && ingredients.nutritionFactsGroups ? ingredients.nutritionFactsGroups : '';
      const hasNutrition = nutrition && nutrition.find(u => u.nutritionFact);
      const nutritionTable = hasNutrition ? nutrition.find(u => u.nutritionFact).nutritionFact.reduce((acc, obj) => {
        const key = obj.nutritionFactName || 'unknown';
        return { ...acc, [key.trim().toLowerCase().split(' ').join('_')]: obj.amountPerServing || '' };
      }, {}) : '';

      const getNutri = (arrOrVal, isUnit) => {
        if (!nutritionTable) return '';
        const nb = isUnit ? 2 : 1;
        const arr = Array.isArray(arrOrVal) ? arrOrVal : [arrOrVal];
        return arr.reduce((acc, query) => {
          return nutritionTable[query] ? nutritionTable[query].split(/(\d+)/)[nb] : acc;
        }, '');
      };

      const videos = prop => [
        ...[...document.querySelectorAll('iframe')].reduce((acc, frame) => {
          return [...acc, ...[...frame.contentWindow.document.querySelectorAll('video')].map(v => v[prop || 'src'])];
        }, []),
        ...[...document.querySelectorAll('video')].map(v => v[prop || 'src']),
      ];

      console.log(desc);
      console.log(fullDescription);

      const obj = {
        _input,
        image: infos.productImageUrl,
        imageAlt: getSelector('#productImg', { property: 'alt' }),
        alternateImages: images,
        metaKeywords: getSelector('meta[name="keywords"]', { property: 'content' }),
        _pageTimeStamp: (new Date()).toISOString(),
        _url,
        category: [infos.tier1Category, infos.tier2Category, infos.tier3Category],
        nameExtended: getSelector('#productTitle'),
        listPrice: priceValue('regularPrice'),
        price: priceValue(['regularPrice', 'salePrice']),
        availabilityText: jsonObj.inventory.shipAvailableMessage ? jsonObj.inventory.shipAvailableMessage : 'In stock',
        description: [desc ? decodeURIComponent(desc.quickView) : '', fullDescription],
        descriptionBullets: document.querySelectorAll('#prodDesc ul > li').length,
        brandText: infos.brandName,
        manufacturer: fullDescription.split('©')[fullDescription.split('©').length - 1],
        quantity: infos.sizeCount,
        weightNet: '',
        weightGross: shipping ? shipping.shippingWeight : '',
        gtin: details.gtin,
        sku: infos.skuId.split('sku')[infos.skuId.split('sku').length - 1],
        variantId: infos.skuId.split('sku')[infos.skuId.split('sku').length - 1],
        mpc: '',
        packSize: infos.prodPacksAvailable,
        legalDisclaimer: '',
        directions: directions ? fullDescription.slice(directions, fullDescription.length) : '',
        warnings: warnings ? warnings.productWarning : '',
        ratingCount: reviews ? reviews.reviewCount : '',
        aggregateRatingText: reviews ? reviews.overallRating : '',
        aggregateRating: reviews ? reviews.overallRating : '',
        shippingInfo: jsonObj.inventory.shippingChargeMsg,
        shippingDimensions: shipping ? shipping.productInInches : '',
        shippingWeight: shipping ? shipping.shippingWeight : '',
        variantCount: Object.entries(jsonObj.inventory.relatedProducts).reduce((acc, [key, arr]) => (+acc + arr.length), 0),
        color: infos.color,
        colorCode: '',
        manufacturerDescription: getSelector('#wc-aplus', { property: 'innerText' }),
        manufacturerImages: [...document.querySelectorAll('#wc-aplus img')].map(u => u.src),
        videos: videos().length > 0 ? videos() : '',
        name: infos.displayName,
        inStorePrice: '',
        asin: '',
        coupon: getSelector('[aria-labelledby="coupon-card"] li span'),
        amazonChoice: '',
        amazonChoiceCategory: '',
        brandLink: infos.brandPageUrl ? `https://www.walgreens.com${infos.brandPageUrl}` : '',
        internationalShipping: '',
        salesRank: '',
        salesRankCategory: '',
        subscriptionPrice: '',
        subscribeAndSave: '',
        heroQuickPromoHeadline: '',
        heroQuickPromoImageUrl: '',
        heroQuickPromoUrl: '',
        pasin: '',
        videoLength: videos().length > 0 ? videos('duration') : '',
        otherSellersPrime: '',
        ingredientImagePresent: '',
        factImagePresent: '',
        largeImageCount: '',
        variantAsins: '',
        primeFlag: '',
        lbb: '',
        lbbPrice: '',
        featureBullets: '',
        otherSellersName: '',
        otherSellersPrice: '',
        otherSellersShipping: '',
        secondaryImageTotal: '',
        news: '',
        addonItem: '',
        fastTrack: '',
        ingredientsList: ingrList ? ingrList.join(' ') : '',
        servingSize: nutrition && nutrition.servingSize ? nutrition.servingSize.split(/(\d+)/)[0] : '',
        servingSizeUom: nutrition && nutrition.servingSize ? nutrition.servingSize.split(/(\d+)/)[1] : '',
        numberOfServingsInPackage: nutrition ? nutrition.servingPerContainer : '',
        caloriesPerServing: getNutri(['calories', 'calorie'], false),
        caloriesFromFatPerServing: '',
        totalFatPerServing: getNutri('fat', false),
        totalFatPerServingUom: getNutri('fat', true),
        saturatedFatPerServing: getNutri('saturated_fat', false),
        saturatedFatPerServingUom: getNutri('saturated_fat', true),
        transFatPerServing: getNutri('trans_fat', false),
        transFatPerServingUom: getNutri('trans_fat', true),
        cholesterolPerServing: getNutri('cholesterol', false),
        cholesterolPerServingUom: getNutri('cholesterol', true),
        sodiumPerServing: getNutri(['salt', 'sodium'], false),
        sodiumPerServingUom: getNutri(['salt', 'sodium'], true),
        totalCarbPerServing: getNutri(['carb', 'carbs', 'carbohydrate', 'total_carbohydrate'], false),
        totalCarbPerServingUom: getNutri(['carb', 'carbs', 'carbohydrate', 'total_carbohydrate'], true),
        dietaryFibrePerServing: getNutri(['fibre', 'fibres', 'dietary_fibre'], false),
        dietaryFibrePerServingUom: getNutri(['fibre', 'fibres', 'dietary_fibre'], true),
        totalSugarsPerServing: getNutri(['sugar', 'sugars', 'total_sugars', 'total_sugar'], false),
        totalSugarsPerServingUom: getNutri(['sugar', 'sugars', 'total_sugars', 'total_sugar'], true),
        proteinPerServing: getNutri(['protein', 'proteins'], false),
        proteinPerServingUom: getNutri(['protein', 'proteins'], true),
        vitaminAPerServing: getNutri('vitamin_a', false),
        vitaminAPerServingUom: getNutri('vitamin_a', true),
        vitaminCPerServing: getNutri('vitamin_c', false),
        vitaminCPerServingUom: getNutri('vitamin_c', true),
        calciumPerServing: getNutri('calcium', false),
        calciumPerServingUom: getNutri('calcium', true),
        ironPerServing: getNutri('iron', false),
        ironPerServingUom: getNutri('iron', true),
        dietarySymbols: '',
        magnesiumPerServing: getNutri('magnesium', false),
        magnesiumPerServingUom: getNutri('magnesium', true),
        saltPerServing: getNutri(['sodium', 'salt'], false),
        saltPerServingUom: getNutri(['sodium', 'salt'], true),
        dietaryInformation: '',
        specifications: '',
        warranty: '',
        storage: '',
        countryOfOrigin: '',
        allergyAdvice: '',
        recyclingInformation: '',
        productOtherInformation: '',
        packaging: '',
        additives: '',
        pricePerUnit: price.unitPrice ? price.unitPrice.split('$')[1] : '',
        pricePerUnitUom: price.unitPrice ? price.unitPrice.split(/(\d+)/)[jsonObj.priceInfo.unitPrice.split(/(\d+)/).length - 1] : '',
        promotion: details.OfferList ? details.OfferList.map(u => u.title) : '',
        alcoholContent: '',
        newVersion: '',
        newAsin: '',
        newDescription: '',
        variantInformation: Object.keys(jsonObj.inventory.relatedProducts),
        firstVariant: Object.entries(jsonObj.inventory.relatedProducts).reduce((acc, [key, arr]) => arr[0].value, ''),
        variants: Object.entries(jsonObj.inventory.relatedProducts).reduce((acc, [key, arr]) => [...acc, ...arr.map(v => v.value)], []),
        additionalDescBulletInfo: '',
        prop65Warning: '',
        ageSuitability: '',
        energyEfficiency: '',
        technicalInformationPdfPresent: 'No',
        termsAndConditions: 'Yes',
        privacyPolicy: 'Yes',
        customerServiceAvailability: 'No',
        materials: '',
        Image360Present: 'No',
        imageZoomFeaturePresent: document.querySelector('#zoomLensContainer') ? 'Yes' : 'No',
      };
      addObjectToDocument(obj);
    }, [id, url]);
    await context.extract(productDetails);
  },
};
