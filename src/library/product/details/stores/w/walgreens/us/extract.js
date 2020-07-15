const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'us',
    store: 'walgreens',
    transform: transform,
    domain: 'walgreens.com',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ url, id }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    // await context.waitForSelector('li#prodCollage');
    const manufacturerInfo = await context.evaluate(function () {
      return document.querySelector('li#prodCollage') ? document.querySelector('li#prodCollage').getAttribute('class') : '';
    });

    await context.evaluate(function () {
      if (document.querySelector('div.fsrModalBackdrop')) {
        document.querySelector('div.fsrModalBackdrop').remove();
      }
    });

    console.log(manufacturerInfo);

    async function autoScroll () {
      await context.evaluate(async function () {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }

    // autoScroll();

    if (manufacturerInfo.length !== 0) {
      await new Promise(resolve => setTimeout(resolve, 30000));
      autoScroll();
      await context.waitForSelector('li#prodCollage > div.inner');
      await context.waitForSelector('a.view-more-trigger');

      // await context.evaluate(function () {
      //   const showMoreButton = document.querySelector('a.view-more-trigger');
      //   console.log(showMoreButton);
      //   if (showMoreButton !== null) {
      //     showMoreButton.className += ' open';
      //     showMoreButton.setAttribute('aria-expanded', 'true');
      //     showMoreButton.click();
      //     console.log(showMoreButton);
      //   }
      // });
    }

    const extractAll = async (id, url, variants) => {
      const extract = async (variantXpath) => {
        await context.evaluate(async ([{ id: _input }, _url, variantXpath]) => {
          const MergeRecursive = (obj1, obj2) => {
            for (var p in obj2) {
              try {
                // Property in destination object set; update its value.
                if (typeof obj2[p] === 'object' && obj2[p] !== null) obj1[p] = MergeRecursive(obj1[p], obj2[p]);
                else obj1[p] = obj2[p];
              } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
              }
            }
            return obj1;
          };
          const getXpath = (selector) => {
            return document.evaluate(selector, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE).singleNodeValue;
          };
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
          const removeObjectToDocument = (obj) => {
            Object.keys(obj).forEach((key) => document.getElementById(`added_${key}`) && document.getElementById(`added_${key}`).remove());
          };
          const getSelector = (selector, { property = 'textContent', doc = document, raw = false, ifError = '' } = {}) => {
            let text = doc.querySelector(selector) ? doc.querySelector(selector)[property] : ifError;
            if (selector === '#wc-aplus' && doc.querySelector('div[data-section-caption="Product Comparison"]')) {
              if (doc.querySelector('.wc-pct-product-columns-wrapper') && doc.querySelector('.wc-pct-header-column-wrapper')) {
                if (doc.querySelector('.wc-pct-product-columns-wrapper')[property] === doc.querySelector('.wc-pct-header-column-wrapper')[property]) {
                  const wcAplusDiv = doc.querySelector('#wc-aplus');
                  const duplicate = wcAplusDiv.cloneNode(true);
                  if (duplicate.querySelector('div.wc-pct-header-column-wrapper')) {
                    duplicate.querySelector('div.wc-pct-header-column-wrapper').remove();
                  }
                  if (duplicate.querySelector('div.wc-json-data')) {
                    duplicate.querySelector('div.wc-json-data').remove();
                  }
                  if (duplicate.querySelector('wc-powered-by-tagline')) {
                    duplicate.querySelector('wc-powered-by-tagline').remove();
                  }
                  text = duplicate[property];
                }
              }
            }
            return raw ? text : text.replace(/\t/gm, ' ').replace(/\s{2,}, ' '/g).replace(/^\s*\n|^.\n/gm, '').trim();
          };

          // wait for full loading
          await new Promise(resolve => setTimeout(resolve, 5e3));

          const foundVariant = !!(variantXpath && getXpath(variantXpath));

          // monkey patch ajax calls
          const originalRequestOpen = XMLHttpRequest.prototype.open;
          let response = {};
          XMLHttpRequest.prototype.open = function () {
            if (arguments[0] === 'POST' && arguments[1].includes('(PriceInfo+Inventory+ProductInfo+ProductDetails)')) {
              this.addEventListener('load', function () {
                try {
                  response = JSON.parse(this.response);
                } catch (error) {
                  response = null;
                }
              });
            }
            originalRequestOpen.apply(this, arguments);
          };
          foundVariant && getXpath(variantXpath).click();

          await new Promise(resolve => setTimeout(resolve, 5e3));
          XMLHttpRequest.prototype.open = originalRequestOpen;

          const jsonObj = MergeRecursive((window.__ATC_APP_INITIAL_STATE__ && window.__ATC_APP_INITIAL_STATE__.product) ? window.__ATC_APP_INITIAL_STATE__.product.results : {}, response);
          console.log(response);
          console.log('jsonObj');
          console.log(jsonObj);

          const infos = jsonObj.productInfo;
          const details = jsonObj.prodDetails;
          const price = jsonObj.priceInfo;

          // const priceOther = JSON.parse(getSelector('script[type="application/ld+json"]', { raw: true, ifError: JSON.stringify({}) }));
          const grabSinglePrice = (price) => {
            return price.split('or 1/')[1];
          };

          const priceValue = (prop) => {
            /*
            if (!Array.isArray(props)) return priceValue([props]);
            const result = props.reduce((acc, prop) => {
              if (!price[prop]) return acc;
              console.log('result')
              console.log(prop)
              if (document.querySelector('#saving-price-info') && prop === 'salePrice') {
                console.log('here')
                return (price.salePrice.split('$').length > 2) ? price.salePrice : '';
              }
              return (price[prop].split('$').length > 2
                ? (priceOther.offers ? priceOther.offers.price : '')
                : price[prop]);
            }, '');
            */
            const result = (document.querySelector('#saving-price-info') && prop === 'salePrice' && price.salePrice) ? (price.salePrice.match('or 1') ? grabSinglePrice(price.salePrice) : price.salePrice) : (price.regularPrice ? (price.regularPrice.match('or 1') ? grabSinglePrice(price.regularPrice) : price.regularPrice) : null);
            if (!result) return '';
            return result.includes('$') ? result : `$${result}`;
          };

          const findInSection = key => ((details.section) ? (details.section.find(u => u[key]) ? details.section.find(u => u[key])[key] : '') : {});

          const desc = findInSection('description');
          const ingredients = findInSection('ingredients');
          const warnings = findInSection('warnings');
          const shipping = findInSection('shipping');
          const reviews = findInSection('reviews');

          console.log(desc);
          console.log(desc.productDesc);

          let fullDescription = (desc && desc.productDesc) ? (((desc.quickView && desc.quickView !== 'undefined') ? decodeURIComponent(desc.quickView.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25')) : '') + decodeURIComponent(desc.productDesc.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25'))) : '';
          console.log('fullDescription');
          console.log(fullDescription);
          fullDescription = fullDescription.replace(/<table.*?>/g, '');
          fullDescription = fullDescription.replace(/<tbody.*?>/g, '');
          fullDescription = fullDescription.replace(/<tr.*?>/g, '');
          fullDescription = fullDescription.replace(/<td.*?>/g, '');
          fullDescription = fullDescription.replace(/<\/table>/g, '');
          fullDescription = fullDescription.replace(/<\/tbody>/g, '');
          fullDescription = fullDescription.replace(/<\/tr>/g, '');
          fullDescription = fullDescription.replace(/<\/td>/g, '');
          fullDescription = fullDescription.replace(/&copy;/g, '©');
          fullDescription = fullDescription.replace(/%C2%A9/g, '©');
          const directions = fullDescription.toLowerCase().indexOf('how to') > -1 ? fullDescription.toLowerCase().indexOf('how to') : '';
          console.log(fullDescription);
          let fullDescriptionWithDoublePipes = fullDescription;
          fullDescriptionWithDoublePipes = fullDescriptionWithDoublePipes.replace(/>/g, '> ');
          fullDescriptionWithDoublePipes = fullDescriptionWithDoublePipes.replace(/<(li)[^>]+>/ig, '<$1>');
          fullDescriptionWithDoublePipes = fullDescriptionWithDoublePipes.replace(/<li>/g, ' ||');
          fullDescriptionWithDoublePipes = fullDescriptionWithDoublePipes.trim();
          const manufacturerName = (fullDescription && fullDescription.match('©') !== null) ? fullDescription.split('©')[fullDescription.split('©').length - 1] : '';
          console.log(manufacturerName);
          const images = infos.filmStripUrl.reduce((acc, obj) => {
            const filtered = Object.entries(obj).filter(([key]) => key.includes('largeImageUrl'));
            const array = filtered && filtered.length === 0 ? ['https:' + Object.entries(obj)[0]] : filtered.map(([key, link]) => 'https:' + link);
            return [...acc, ...array];
          }, []);

          console.log('ingredients');
          console.log(ingredients);

          console.log(infos);

          const cleanupIngredient = (typename) => {
            // const ingredDivText = document.querySelector('li#Ingredients');
            // if (ingredDivText && ingredDivText.textContent && (ingredDivText.textContent.includes('Active') || ingredDivText.textContent.includes('Inactive'))) {
            // if (ingredDivText && ingredDivText.textContent) {
            return typename.charAt(0).toUpperCase() + typename.slice(1) + ' Ingredients: ';
            // }
            // return '';
          };

          const formatIngredientList = (ingredientsList) => {
            // if (ingredientsList && ingredientsList.length > 1) {
            //   for (var i = 0; i < ingredientsList.length; i++) {
            //     if ((i !== ingredientsList.length - 1) && (ingredientsList[i].slice(-1) !== ',')) {
            //       ingredientsList[i] += ',';
            //     }
            //   }
            // }
            if (ingredientsList.length === 1) {
              return ingredientsList;
            }
            console.log(ingredientsList);
            return ingredientsList.join(', ');
          };

          const hasIngrList = ingredients && ingredients.ingredientGroups &&
            ingredients.ingredientGroups.find(u => u.ingredientTypes) &&
            ingredients.ingredientGroups.find(u => u.ingredientTypes).ingredientTypes.find(u => u.ingredients);
          const ingrList = () => {
            const ingredList = hasIngrList ? ingredients.ingredientGroups.find(u => u.ingredientTypes).ingredientTypes.reduce((acc, obj) => [...acc, cleanupIngredient(obj.typeName), formatIngredientList(obj.ingredients)], []).join(' ') : '';
            const ingredListDom = () => {
              if (document.querySelector('li#Ingredients div.inner')) {
                let ingredText = document.querySelector('li#Ingredients div.inner').innerText.replace(/\s\s+/g, ' ');

                if (ingredText.includes('Active Ingredient') || ingredText.includes('Inactive Ingredient')) {
                  ingredText = ingredText.includes('Active Ingredient') ? ingredText.replace('Active Ingredients', ' Active Ingredients').trim() : ingredText;
                  ingredText = ingredText.includes('Inactive Ingredient') ? ingredText.replace('Inactive Ingredients', ' Inactive Ingredients').trim() : ingredText;
                  return ingredText;
                } else {
                  return '';
                }
              }
              return '';
            };
            const ingredListDomText = ingredListDom();

            if (ingredListDomText.length !== 0) {
              return ingredListDomText;
            } else {
              return ingredList;
            }
          };

          // if (ingredients && ingredients.ingredientGroups && ingredients.ingredientGroups[0] && ingredients.ingredientGroups[0].ingredientTypes && ingredients.ingredientGroups[0].ingredientTypes.typeName) {
          //   const typeOfIngredientStr = ingredients.ingredientTypes.typeName;
          //   const typeOfIngredient = typeOfIngredientStr.charAt(0).toUpperCase() + typeOfIngredientStr.slice(1) + 'Ingredients: ';
          //   ingrList.unshift(typeOfIngredient);
          // }

          const nutrition = ingredients && ingredients.nutritionFactsGroups ? ingredients.nutritionFactsGroups : '';
          const hasNutrition = nutrition && nutrition.find(u => u.nutritionFact);
          const nutritionTable = hasNutrition ? nutrition.find(u => u.nutritionFact).nutritionFact.reduce((acc, obj) => {
            const key = obj.nutritionFactName || 'unknown';
            return { ...acc, [key.replace(/\([^()]*\)/, '').trim().toLowerCase().split(' ').join('_')]: obj.amountPerServing || '' };
          }, {}) : '';

          const getNutri = (arrOrVal, isUnit) => {
            if (!nutritionTable) return '';
            console.log(nutritionTable);
            const nb = isUnit ? 2 : 1;
            const arr = Array.isArray(arrOrVal) ? arrOrVal : [arrOrVal];
            return arr.reduce((acc, query) => {
              return nutritionTable[query] ? nutritionTable[query].split(/(\d+)/)[nb] : acc;
            }, '');
          };

          const videos = () => [
            ...[...document.querySelectorAll('iframe')].reduce((acc, frame) => {
              if (!frame.allowFullscreen) return acc;
              if (frame.contentWindow.settings && frame.contentWindow.settings.itemsList) {
                const fullPath = (frame.contentWindow.document.querySelector('video') && frame.contentWindow.document.querySelector('video').src) ? frame.contentWindow.document.querySelector('video').src : null;
                const root = fullPath ? fullPath.split('/_cp')[0] : '';
                return [...acc, ...[...frame.contentWindow.settings.itemsList].filter(v => (v.src && v.src.src)).map(v => root + v.src.src)];
              }
              return [...acc, ...[...frame.contentWindow.document.querySelectorAll('video')].filter(v => (v.src)).map(v => v.src)];
            }, []),
            ...[...document.querySelectorAll('video')].filter(v => (v.src)).map(v => v.src),
          ];

          const videosDurations = () => [...[...document.querySelectorAll('iframe')].reduce((acc, frame) => {
            if (!frame.allowFullscreen) return acc;
            if (frame.contentWindow.settings && frame.contentWindow.settings.itemsList) {
              return [...acc, ...[...frame.contentWindow.settings.itemsList].filter(v => (v.duration)).map(v => v.duration)];
            }
            return [...acc, ...[...frame.contentWindow.document.querySelectorAll('video')]];
          }, []),
          ...[...document.querySelectorAll('video')].filter(v => (v.duration)).map(v => v.duration),
          ];

          const allVideos = videos().filter(v => !(/(png)/.test(v)) && !(/(jpg)/.test(v)) && !(/(jpeg)/.test(v)));
          console.log('allVideos');
          console.log(allVideos);

          const restrictedStatesList = () => {
            const states = [];
            document.querySelectorAll('ul[class^="state-code-restricted"] > li').forEach((li) => states.push(li.textContent));
            if (states.length === 1) {
              return states.join('');
            }
            if (states.length > 1) {
              return states.join(', ');
            }
            return '';
          };

          const shippingInfoContent = () => {
            let shippingInfoTextContent = '';
            const shippingEnableID = (document.querySelector('p#shiptostoreenable')) ? 'shiptostoreenable' : 'shiptostoredisable';

            if (document.querySelector('p#' + shippingEnableID) && document.querySelector('p#' + shippingEnableID).textContent) {
              shippingInfoTextContent += document.querySelector('p#' + shippingEnableID).textContent;
            }

            if (document.querySelector('p#' + shippingEnableID) && document.querySelector('p#' + shippingEnableID).nextElementSibling && document.querySelector('p#' + shippingEnableID).nextElementSibling.textContent) {
              shippingInfoTextContent += ' ' + document.querySelector('p#' + shippingEnableID).nextElementSibling.textContent + ' ' + restrictedStatesList();
            }

            if (shippingInfoTextContent.length === 0 && (jsonObj.inventory.shippingChargeMsg || (jsonObj.inventory.restrictedStates && jsonObj.inventory.restrictedStates.length === 0))) {
              shippingInfoTextContent = 'This product has no shipping restrictions.';
            }

            if (document.querySelector('p[class^="universal-Shipping-Weight"]')) {
              shippingInfoTextContent += ' ' + document.querySelector('p[class^="universal-Shipping-Weight"]').textContent;
            }

            if (document.querySelector('p[class^="universal-product-inches"]')) {
              shippingInfoTextContent += ' ' + document.querySelector('p[class^="universal-product-inches"]').textContent;
            }

            return shippingInfoTextContent;
          };

          const promotions = () => {
            const notPromotionRe = /(donation)/ig;
            const isPromotionRe = /(rebate)|(Extra Savings)/ig;
            const promotion = details.OfferList ? details.OfferList.map(u => !notPromotionRe.test(u.title) ? (u.redirectPageTitle ? u.redirectPageTitle : u.title) : '') : '';
            if (isPromotionRe.test(promotion)) {
              return (price && price.rebateOffers && price.rebateOffers.rebateText) ? price.rebateOffers.rebateText : '';
            }
            return promotion;
          };

          const customWarning = () => {
            console.log('customWarning');
            if (document.querySelector('div.description') && (document.querySelector('div.description').innerHTML.match(/<p><strong>WARNING:<\/strong>.*?<\/p>/)) !== null) {
              // if ((document.querySelector('div.description').innerHTML.match(/<p><strong>WARNING:<\/strong>.*?<\/p>/))[0] !== null) {}
              const htmlTagWithWarnings = (document.querySelector('div.description').innerHTML.match(/<p><strong>WARNING:<\/strong>.*?<\/p>/))[0];
              const parser = new DOMParser();
              const doc = parser.parseFromString(htmlTagWithWarnings, 'text/html');
              if (doc.querySelector('p') && doc.querySelector('p').textContent) {
                return doc.querySelector('p').textContent;
              } else {
                return '';
              }
            }
            return '';
          };

          console.log(jsonObj.inventory);
          console.log(jsonObj.inventory.shipAvailableMessage);
          const obj = {
            _input,
            image: infos.productImageUrl,
            imageAlt: getSelector('#productImg', { property: 'alt' }),
            alternateImages: images,
            metaKeywords: getSelector('meta[name="keywords"]', { property: 'content' }),
            _pageTimeStamp: (new Date()).toISOString(),
            _url,
            productUrl: window.location.href,
            category: [infos.tier1Category, infos.tier2Category, infos.tier3Category],
            nameExtended: infos.title,
            listPrice: priceValue('regularPrice'),
            price: priceValue('salePrice'),
            availabilityText: jsonObj.inventory.shipAvailable ? 'In Stock' : 'Out of Stock',
            description: fullDescriptionWithDoublePipes,
            descriptionBullets: (document.querySelector('#prodDesc') && document.querySelectorAll('#prodDesc ul > li')) ? document.querySelectorAll('#prodDesc ul > li').length : (document.querySelectorAll('div.description p') ? document.querySelectorAll('div.description p').length : 0),
            brandText: infos.brandName,
            manufacturer: manufacturerName,
            quantity: infos.sizeCount,
            weightNet: '',
            weightGross: shipping ? shipping.shippingWeight : '',
            gtin: (jsonObj && jsonObj.inventory && jsonObj.inventory.upc) ? jsonObj.inventory.upc : '', // one digit shortening to match old output
            sku: infos.skuId.split('sku')[infos.skuId.split('sku').length - 1],
            variantId: jsonObj.inventory.wicId,
            mpc: '',
            packSize: infos.prodPacksAvailable,
            legalDisclaimer: '',
            directions: directions && fullDescription ? fullDescription.slice(directions, fullDescription.length) : '',
            warnings: (warnings && warnings.productWarning) ? ((warnings.productWarning).replace(/<[P|p]>/g, '<p> ')) : customWarning(),
            ratingCount: reviews ? reviews.reviewCount : '',
            aggregateRatingText: reviews ? reviews.overallRating : '',
            aggregateRating: reviews ? reviews.overallRating : '',
            shippingInfo: shippingInfoContent(),
            // jsonObj.inventory.shippingChargeMsg || (jsonObj.inventory.restrictedStates && jsonObj.inventory.restrictedStates.length === 0) ? 'This product has no shipping restrictions.' : jsonObj.inventory.restrictedStates ? jsonObj.inventory.restrictedStates.join(', ') : ((document.querySelector('p#shiptostoreenable') && document.querySelector('p#shiptostoreenable').nextElementSibling && document.querySelector('p#shiptostoreenable').nextElementSibling.textContent) ? document.querySelector('p#shiptostoreenable').nextElementSibling.textContent + restrictedStatesList() : ''),
            shippingDimensions: shipping ? shipping.productInInches : '',
            shippingWeight: shipping ? shipping.shippingWeight : '',
            variantCount: Object.entries(jsonObj.inventory.relatedProducts).reduce((acc, [key, arr]) => (+acc + (arr ? arr.length : 0)), 0),
            color: infos.color,
            colorCode: '',
            manufacturerDescription: getSelector('#wc-aplus', { property: 'innerText' }),
            manufacturerImages: [...document.querySelectorAll('#wc-aplus img')].map(u => u.src).filter(img => !img.match('syndigo')),
            videos: allVideos && allVideos.length > 0 ? allVideos : '',
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
            videoLength: videos() && videos().length > 0 ? videosDurations().filter(duration => (duration !== undefined)) : '',
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
            secondaryImageTotal: infos.filmStripUrl ? infos.filmStripUrl.length : 0,
            news: '',
            addonItem: '',
            fastTrack: '',
            ingredientsList: hasIngrList ? ingrList() : '',
            // ingredientsList: ingrList ? (Array.isArray(ingrList) ? ingrList.join(' ') : ingrList) : '',
            // ingredientsList: ingrList ? ingrList[0] + ' ' + ingrList.slice(2, -1).join(', ') + ', ' + ingrList.slice(-1) : '',
            servingSize: nutrition && nutrition[0] && nutrition[0].servingSize && (nutrition[0].servingSize.match(/(\d*\.?\d+)/)[0] !== null) ? nutrition[0].servingSize.match(/(\d*\.?\d+)/)[0] : '',
            servingSizeUom: nutrition && nutrition[0] && nutrition[0].servingSize && (nutrition[0].servingSize.match(/([a-zA-Z\s]+)/)[0] !== null) ? nutrition[0].servingSize.match(/([a-zA-Z\s]+)/)[0] : '',
            numberOfServingsInPackage: nutrition && nutrition[0] && nutrition[0].servingPerContainer ? nutrition[0].servingPerContainer : '',
            caloriesPerServing: getNutri(['calories', 'calorie'], false),
            caloriesFromFatPerServing: '',
            totalFatPerServing: getNutri(['fat', 'total_fat'], false),
            totalFatPerServingUom: getNutri(['fat', 'total_fat'], true),
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
            promotion: promotions(),
            alcoholContent: '',
            newVersion: '',
            newAsin: '',
            newDescription: '',
            variantInformation: infos.primaryAttribute ? infos.primaryAttribute : (infos.color ? infos.color : ''),
            // variantInformation: infos.primaryAttribute ? infos.primaryAttribute : infos.color,
            // Object.keys(jsonObj.inventory.relatedProducts),
            firstVariant: infos.productId.split('prod')[infos.productId.split('prod').length - 1], // Object.entries(jsonObj.inventory.relatedProducts).reduce((acc, [key, arr]) => arr[0].value, ''),
            variants: Object.entries(jsonObj.inventory.relatedProducts).reduce((acc, [key, arr]) => [...acc, ...arr.map(v => v.value)], []),
            additionalDescBulletInfo: [...document.querySelectorAll('#prodDesc ul > li')].map(d => d.textContent),
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
          removeObjectToDocument(obj);
          addObjectToDocument(obj);
        }, [id, url, variantXpath]);

        await context.extract(productDetails, { transform: transformParam, type: 'APPEND' });
      };
      if (variants.length === 0) return await extract();
      for (let index = 0; index < variants.length; index++) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await extract(variants[index]);
      };
    };

    const variantArray = await context.evaluate(async () => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      const jsonObj = (window.__ATC_APP_INITIAL_STATE__ && window.__ATC_APP_INITIAL_STATE__.product && window.__ATC_APP_INITIAL_STATE__.product.results) ? window.__ATC_APP_INITIAL_STATE__.product.results : {};
      const getXpathByText = (xpath, attribute, text) => {
        const classCheat = `[contains(concat(' ',normalize-space(@${attribute}),' '),'${text}')]`;
        return (xpath + classCheat);
      };
      const result = Object.entries(Object.keys(jsonObj).length ? jsonObj.inventory.relatedProducts : {})
        .reduce((acc, [key, arr]) => [...acc, ...arr.map(v => v.url)], [])
        .map(url => (getXpathByText('//li//a', 'style', url)));
      if (result.length > 21) {
        result.splice(21, result.length);
        // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
      }
      console.log(result);
      return result;
    });

    await extractAll(id, url, variantArray);
  },
};
