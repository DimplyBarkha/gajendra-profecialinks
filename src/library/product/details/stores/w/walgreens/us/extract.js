const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'us',
    store: 'walgreens',
    transform,
    domain: 'walgreens.com',
  },
  dependencies: {
    helperModule: 'module:helpers/helpers',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ url, id }, { country, domain, transform: transformParam }, context, dependencies) => {
    const { helperModule: { Helpers }, productDetails } = dependencies;
    const helper = new Helpers(context);

    const loadMoreManufacturer = await context.evaluate(function () {
      return document.querySelector('li#prodCollage') ? (document.querySelector('li#prodCollage').innerText.match('Loading manufacturer content') !== null) : false;
    });

    const noManufacturerContent = await context.evaluate(function () {
      return document.querySelector('li#prodCollage') ? (document.querySelector('li#prodCollage').innerText.match('Could not get manufacturer content') !== null) : false;
    });

    const ignoreSurveyPopups = async () => {
      await helper.ifThereClickOnIt('button.fsrDeclineButton');
      await helper.ifThereClickOnIt('div.fsrAbandonButton');
      await helper.ifThereClickOnIt('button#fsrFocusFirst');
    };
    // remove modal
    const closeModals = () => context.evaluate(() => {
      if (document.querySelector('div.fsrModalBackdrop')) {
        document.querySelector('div.fsrModalBackdrop').remove();
      }
      if (document.querySelector('div#fsrInvite') && document.querySelector('div#fsrFullScreenContainer')) {
        document.querySelector('div#fsrFullScreenContainer').remove();
      }
    });
    await ignoreSurveyPopups();
    await closeModals();


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

    // wait for manufacturer nodes and review nodes
    await autoScroll();
    await helper.waitForSelector('li#prodbv', { timeout: 55000 });
    await helper.waitForSelector('li#prodCollage', { timeout: 55000 });
    await autoScroll();
    await helper.waitForSelector('li#prodCollage > div.inner', { timeout: 135000 });
    await helper.waitForSelector('li#prodCollage a.view-more-trigger', { timeout: 55000 }, false)
      .catch(() => {
        if (noManufacturerContent) console.log('No manufacturer content loading');
        else throw new Error('Manufacturer content loading issue') 
      });
    if (!noManufacturerContent && loadMoreManufacturer) {
      await helper.waitForSelector('div#wc-aplus', { timeout: 55000 });
      await helper.waitForSelector('div.wc-fragment', { timeout: 35000 });
    }

    await helper.waitForSelector('#BVRRSummaryContainer', { timeout: 2000 })
    await helper.waitForSelector('div.bv-cleanslate', { timeout: 30000 });

    const variantArray = await context.evaluate(async () => {
      // await new Promise(resolve => setTimeout(resolve, 5000));
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
      }
      console.log(result);
      return result;
    });

    const extract = async (variantXpath) => {
      await context.waitForSelector('.product__price', { timeout: 20000 }); // wait till the page loads
      await ignoreSurveyPopups();
      await closeModals();
      await context.evaluate(async ([{ id: _input }, _url, variantXpath]) => {
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
        // const jsonObj = response;
        console.log('response: %o', response);
        const jsonObj = Object.keys(response).length !== 0 ? response : ((window.__ATC_APP_INITIAL_STATE__ && window.__ATC_APP_INITIAL_STATE__.product) ? window.__ATC_APP_INITIAL_STATE__.product.results : {});
        console.log('jsonObj: %o', jsonObj);

        const infos = jsonObj.productInfo;
        const details = jsonObj.prodDetails;
        const price = jsonObj.priceInfo;

        const grabSinglePrice = (price) => {
          return price.split('or 1/')[1];
        };

        const priceValue = (prop) => {
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

        let fullDescription = (desc && desc.productDesc) ? (((desc.quickView && desc.quickView !== 'undefined') ? decodeURIComponent(desc.quickView.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25')) : '') + decodeURIComponent(desc.productDesc.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25'))) : '';
        fullDescription = fullDescription
          .replace(/<table.*?>/g, '')
          .replace(/<tbody.*?>/g, '')
          .replace(/<tr.*?>/g, '')
          .replace(/<td.*?>/g, '')
          .replace(/<\/table>/g, '')
          .replace(/<\/tbody>/g, '')
          .replace(/<\/tr>/g, '')
          .replace(/<\/td>/g, '')
          .replace(/&copy;/g, '©')
          .replace(/%C2%A9/g, '©')
          .replace(/<p.*?>/g, '<p> ')
          .replace('&#169;', '©');
        const directions = fullDescription.toLowerCase().indexOf('how to') > -1 ? fullDescription.toLowerCase().indexOf('how to') : '';
        const fullDescriptionWithDoublePipes = fullDescription
          .replace(/>/g, '> ')
          .replace(/<(li)[^>]+>/ig, '<$1>')
          .replace(/<li>/g, ' ||')
          .replace(/<(LI)[^>]+>/ig, '<$1>')
          .replace(/<LI>/g, ' ||')
          .trim();
        const index = fullDescription.lastIndexOf('©');
        const manufacturerName = (fullDescription && index !== -1) ? fullDescription.substring(index + 1).trim() : '';
        const images = infos.filmStripUrl.reduce((acc, obj) => {
          const filtered = Object.entries(obj).filter(([key]) => key.includes('largeImageUrl'));
          const array = filtered && filtered.length === 0 ? ['https:' + Object.entries(obj)[0]] : filtered.map(([key, link]) => 'https:' + link);
          return [...acc, ...array];
        }, []);

        const cleanupIngredient = (typename) => {
          return typename.charAt(0).toUpperCase() + typename.slice(1) + ' Ingredients: ';
        };

        const formatIngredientList = (ingredientsList) => {
          if (ingredientsList.length === 1) {
            return ingredientsList;
          }
          return ingredientsList.join(', ');
        };

        const hasIngrList = ingredients && ingredients.ingredientGroups &&
          ingredients.ingredientGroups.find(u => u.ingredientTypes) &&
          ingredients.ingredientGroups.find(u => u.ingredientTypes).ingredientTypes.find(u => u.ingredients);

        const useIngredJson = (ingredientGroups, ingredText) => {
          const ingredArr = [];

          for (let i = 0; i < ingredientGroups.length; i++) {
            if (ingredientGroups[i].ingredientTypes) {
              if (ingredText.includes(ingredientGroups[i].groupName)) {
                ingredArr.push(ingredientGroups[i].groupName);
              }
              const ingredGroup = ingredientGroups[i].ingredientTypes;
              for (let j = 0; j < ingredGroup.length; j++) {
                ingredArr.push(cleanupIngredient(ingredGroup[j].typeName));
                ingredArr.push(formatIngredientList(ingredGroup[j].ingredients));
              }
            }
          }
          return ingredArr;
        };
        const ingrList = () => {
          let ingredText = (document.querySelector('li#Ingredients div.inner')) ? document.querySelector('li#Ingredients div.inner').innerText : '';
          const ingredList = hasIngrList ? useIngredJson(ingredients.ingredientGroups, ingredText).join(' ') : '';

          const ingredListDom = () => {
            if (document.querySelector('li#Ingredients div.inner')) {
              ingredText = ingredText.replace(/\s\s+/g, ' ');

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

        const nutrition = ingredients && ingredients.nutritionFactsGroups ? ingredients.nutritionFactsGroups : '';
        const hasNutrition = nutrition && nutrition.find(u => u.nutritionFact);
        const nutritionTable = hasNutrition ? nutrition.find(u => u.nutritionFact).nutritionFact.reduce((acc, obj) => {
          const key = obj.nutritionFactName || 'unknown';
          return { ...acc, [key.replace(/\([^()]*\)/, '').trim().toLowerCase().split(' ').join('_')]: obj.amountPerServing || '' };
        }, {}) : '';

        const getNutri = (arrOrVal, isUnit) => {
          if (!nutritionTable) return '';
          const nb = isUnit ? 2 : 1;
          const arr = Array.isArray(arrOrVal) ? arrOrVal : [arrOrVal];
          return arr.reduce((acc, query) => {
            const hasGreaterThanOrLessThan = (nutritionTable[query] && nutritionTable[query].split(/(\d*\.?\d+)/)[0].length !== 0 && (/[>|<]/).test(nutritionTable[query].split(/(\d*\.?\d+)/)[0]));
            if (isUnit) {
              return nutritionTable[query] ? nutritionTable[query].split(/(\d*\.?\d+)/)[nb] : acc;
            }
            return nutritionTable[query] ? (hasGreaterThanOrLessThan ? nutritionTable[query].split(/(\d*\.?\d+)/)[0] : '') + nutritionTable[query].split(/(\d*\.?\d+)/)[nb] : acc;
          }, '');
        };
        const getShadowRoots = (elem, resArr = []) => {
          if (elem.shadowRoot) return [...resArr, elem.shadowRoot];
          return [...elem.childNodes]
            .reduce((acc, elC) => [...acc, ...resArr, ...getShadowRoots(elC, resArr)], resArr);
        };
        const arrayOfSubDoms = [
          // @ts-ignore
          ...[...document.querySelectorAll('iframe')], // requires to discard CSP
          ...getShadowRoots(document.body),
        ];
        const vidFilter = array => array.filter(v => v.src).map(({ src, duration }) => ({ src, duration }))
        const videos = () => [
          ...arrayOfSubDoms.reduce((acc, frame) => {
            if (!frame.host && !frame.allowFullscreen) return acc;
            let doc;
            try {
              doc = frame.contentWindow ? frame.contentWindow.document : frame;
            } catch (error) {
              // restricted iframe
              return acc;
            }
            if (frame.host) return [...acc, ...vidFilter([...frame.querySelectorAll('video')])];
            if (frame.contentWindow.settings && frame.contentWindow.settings.itemsList) {
              const fullPath = (frame.contentWindow.document.querySelector('video') && frame.contentWindow.document.querySelector('video').src) ? frame.contentWindow.document.querySelector('video').src : null;
              const root = fullPath ? fullPath.split('/_cp')[0] : '';
              return [...acc, ...[...frame.contentWindow.settings.itemsList].filter(v => (v.src && v.src.src)).map(v => ({ src: root + v.src.src, duration: v.duration }))];
            }
            return [...acc, ...vidFilter([...frame.contentWindow.document.querySelectorAll('video')])];
          }, []),
          ...vidFilter([...document.querySelectorAll('video')]),
        ];
        const allVideos = videos().filter(({ src }) => !(/(png)/.test(src)) && !(/(jpg)/.test(src)) && !(/(jpeg)/.test(src)));

        const restrictedStatesList = () => {
          const states = [];
          [...document.querySelectorAll('ul[class^="state-code-restricted"] > li')].forEach((li) => states.push(li.textContent));
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

          if (document.querySelector('div#product-description li#Shipping a')) {
            document.querySelector('div#product-description li#Shipping a').click();
          }

          const shippingEnableID = (document.querySelector('p#shiptostoreenable')) ? 'shiptostoreenable' : 'shiptostoredisable';

          if (document.querySelector('p#' + shippingEnableID) && (document.querySelector('p#' + shippingEnableID).textContent)) {
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

          if (document.querySelector('div#product-description li#Description a')) {
            document.querySelector('div#product-description li#Description a').click();
          }

          return shippingInfoTextContent;
        };

        const promotions = () => {
          if (!document.querySelector('span[class^="product-offer-text"]')) {
            return '';
          }
          const mixMatch = 'Mix & match products';
          const notPromotionRe = /(donation)|[Rr]eward|[Pp]oint|[Pp]ts/ig;
          const isPromotionRe = /(rebate)|(Extra Savings)/ig;
          const promotion = details.OfferList ? details.OfferList.map(u => (!notPromotionRe.test(u.title) && !notPromotionRe.test(u.linkText)) ? (u.linkText === mixMatch ? (u.title) : (u.linkText ? u.linkText : u.title)) : []) : [];
          promotion.forEach((promo) => {
            if (isPromotionRe.test(promo)) {
              promo = (price && price.rebateOffers && price.rebateOffers.rebateText) ? price.rebateOffers.rebateText : '';
            }
          });
          return promotion.join(' ');
        };

        const customWarning = () => {
          if (document.querySelector('div.description') && (document.querySelector('div.description').innerHTML.match(/<p><strong>WARNING:<\/strong>.*?<\/p>/)) !== null) {
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

        const isVisible = (elem) => elem.offsetWidth > 0 || elem.offsetHeight > 0;

        const manufacturerDescription = () => {
          return [...[...document.querySelectorAll('.wc-fragment, .wc-footnotes')].filter(elem => isVisible(elem)).reduce((acc, frame) => {
            if (frame.querySelector('iframe')) {
              const text = (frame && frame.innerText) ? frame.innerText : '';
              const iframe = frame.querySelector('iframe');
              if (!iframe.allowFullscreen) return acc;
              if (iframe.contentWindow && iframe.contentWindow.settings && iframe.contentWindow.settings.itemsList) {
                return [...acc, text, ...[...iframe.contentWindow.settings.itemsList].filter(v => (v.caption && v.description)).map(v => v.caption + ' ' + v.description)];
              } else {
                return acc;
              }
            } else if (frame) {
              if (frame.querySelector('span.wc-screen-reader-only')) {
                [...frame.querySelectorAll('span.wc-screen-reader-only')].forEach((elem) => {
                  elem.style.display = 'none';
                  elem.innerText = ' ';
                  elem.textContent = ' ';
                });
              }
              return [...acc, [frame.innerText.replace(/\s+/gm, ' ')]];
            } else {
              return acc;
            }
          }, [])].join(' ');
        };

        const manufacturerImages = () => {
          return [...[...document.querySelectorAll('.wc-fragment')].reduce((acc, frame) => {
            if (frame.querySelector('iframe')) {
              const imgSrc = frame.querySelector('img') ? frame.querySelector('img').src : '';
              const iframe = frame.querySelector('iframe');
              if (!iframe.allowFullscreen) return acc;
              return [...acc, imgSrc, ...[...iframe.contentDocument.querySelectorAll('img')].filter(v => (v.src)).map(v => v.src)];
            } else {
              return [...acc, ...[...frame.querySelectorAll('img') ? [...frame.querySelectorAll('img')].map(u => u.src).filter(img => !img.match('syndigo')) : '']];
            }
          }, [])];
        };

        const additionalDescBulletInfo = () => {
          if (document.querySelectorAll('#prodDesc ul > li').length) {
            return [...document.querySelectorAll('#prodDesc ul > li')].map(d => d.textContent);
          }
          if (document.querySelectorAll('div.description li, div.description tr').length) {
            return [...document.querySelectorAll('div.description li, div.description tr')].map(d => d.textContent);
          }
          if (document.querySelectorAll('div.content ul.list-styles li').length) {
            return [...document.querySelectorAll('div.content ul.list-styles li')].map(d => d.textContent);
          }
          return '';
        };

        console.log(jsonObj.inventory);
        console.log(jsonObj.inventory.shipAvailableMessage);
        const obj = {
          _input,
          image: infos.productImageUrl,
          alternateImages: images,
          _pageTimeStamp: (new Date()).toISOString(),
          _url,
          productUrl: window.location.href,
          category: [infos.tier1Category, infos.tier2Category, infos.tier3Category],
          nameExtended: infos.title,
          listPrice: priceValue('regularPrice'),
          price: priceValue('salePrice'),
          availabilityText: jsonObj.inventory.shipAvailable ? 'In Stock' : (jsonObj.inventory.shipAvailableMessage.includes('Not sold online') ? 'Not sold online' : 'Out of Stock'),
          description: fullDescriptionWithDoublePipes,
          descriptionBullets: (document.querySelector('#prodDesc') && document.querySelectorAll('#prodDesc ul > li')) ? document.querySelectorAll('#prodDesc ul > li').length : (document.querySelectorAll('div.description li, div.description tr') ? document.querySelectorAll('div.description li, div.description tr').length : (document.querySelectorAll('div.description p') ? document.querySelectorAll('div.description p').length : 0)),
          brandText: infos.brandName,
          manufacturer: manufacturerName,
          quantity: infos.sizeCount,
          weightNet: '',
          weightGross: shipping ? shipping.shippingWeight : '',
          gtin: (jsonObj && jsonObj.inventory && jsonObj.inventory.upc) ? jsonObj.inventory.upc : '', // one digit shortening to match old output
          sku: infos.skuId.split('sku')[infos.skuId.split('sku').length - 1],
          variantId: jsonObj.inventory.wicId,
          mpc: '',
          legalDisclaimer: '',
          directions: directions && fullDescription ? fullDescription.slice(directions, fullDescription.length) : '',
          warnings: (warnings && warnings.productWarning) ? ((warnings.productWarning).replace(/<[P|p]>/g, '<p> ').replace(/(<li>)/g, '<li> ').replace(/(<LI>)/g, '<li> ')) : customWarning(),
          shippingInfo: shippingInfoContent(),
          shippingDimensions: shipping ? shipping.productInInches : '',
          shippingWeight: shipping ? shipping.shippingWeight : '',
          variantCount: Object.entries(jsonObj.inventory.relatedProducts).reduce((acc, [key, arr]) => (+acc + (arr ? arr.length : 0)), 0),
          color: infos.color,
          manufacturerDescription: manufacturerDescription(),
          manufacturerImages: manufacturerImages(),
          videos: allVideos && allVideos.length > 0 ? allVideos.map(v => v.src) : '',
          name: infos.displayName,
          coupon: [...document.querySelectorAll('[aria-labelledby="coupon-card"] li span:not([aria-hidden="true"])')].map(u => u.textContent).join(' '),
          brandLink: infos.brandPageUrl ? `https://www.walgreens.com${infos.brandPageUrl}` : '',
          videoLength: allVideos && allVideos.length > 0 ? allVideos.filter(({ duration }) => (duration !== undefined)).map(v => v.duration) : '',
          secondaryImageTotal: infos.filmStripUrl ? infos.filmStripUrl.length : 0,
          ingredientsList: hasIngrList ? ingrList() : '',
          // eslint-disable-next-line no-useless-escape
          servingSize: nutrition && nutrition[0] && nutrition[0].servingSize && (nutrition[0].servingSize.match(/(\d+[\/\d. ]*|\d)/)[0] !== null) ? nutrition[0].servingSize.match(/(\d+[\/\d. ]*|\d)/)[0] : '',
          servingSizeUom: nutrition && nutrition[0] && nutrition[0].servingSize && (nutrition[0].servingSize.match(/([a-zA-Z\s]+)/)[0] !== null) ? nutrition[0].servingSize.match(/([a-zA-Z\s]+)/)[0] : '',
          numberOfServingsInPackage: nutrition && nutrition[0] && nutrition[0].servingPerContainer ? nutrition[0].servingPerContainer : '',
          caloriesPerServing: getNutri(['calories', 'calorie'], false),
          caloriesFromFatPerServing: getNutri(['calories_from_fat', 'calories_from_fat_-_calories'], false),
          totalFatPerServing: getNutri(['fat', 'total_fat'], false),
          totalFatPerServingUom: getNutri(['fat', 'total_fat'], true),
          saturatedFatPerServing: getNutri('saturated_fat', false),
          saturatedFatPerServingUom: getNutri('saturated_fat', true),
          transFatPerServing: getNutri(['trans_fat', 'trans_fat_-_total_fat'], false),
          transFatPerServingUom: getNutri(['trans_fat', 'trans_fat_-_total_fat'], true),
          cholesterolPerServing: getNutri('cholesterol', false),
          cholesterolPerServingUom: getNutri('cholesterol', true),
          sodiumPerServing: getNutri(['salt', 'sodium'], false),
          sodiumPerServingUom: getNutri(['salt', 'sodium'], true),
          totalCarbPerServing: getNutri(['carb', 'carbs', 'carbohydrate', 'carbohydrates', 'total_carbohydrate'], false),
          totalCarbPerServingUom: getNutri(['carb', 'carbs', 'carbohydrate', 'carbohydrates', 'total_carbohydrate'], true),
          dietaryFibrePerServing: getNutri(['fibre', 'fibres', 'dietary_fibre'], false),
          dietaryFibrePerServingUom: getNutri(['fibre', 'fibres', 'dietary_fibre'], true),
          totalSugarsPerServing: getNutri(['sugar', 'sugars', 'total_sugars', 'total_sugar', 'sugars_-_carbohydrates'], false),
          totalSugarsPerServingUom: getNutri(['sugar', 'sugars', 'total_sugars', 'total_sugar', 'sugars_-_carbohydrates'], true),
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
          magnesiumPerServing: getNutri('magnesium', false),
          magnesiumPerServingUom: getNutri('magnesium', true),
          saltPerServing: getNutri(['sodium', 'salt'], false),
          saltPerServingUom: getNutri(['sodium', 'salt'], true),
          pricePerUnit: price.unitPrice ? price.unitPrice.split('$')[1] : '',
          pricePerUnitUom: price.unitPriceSize ? (price.unitPriceSize.includes('undefined') ? '' : price.unitPriceSize) : '',
          promotion: promotions(),
          variantInformation: infos.primaryAttribute ? infos.primaryAttribute : (infos.color ? infos.color : ''),
          firstVariant: infos.productId.split('prod')[infos.productId.split('prod').length - 1],
          variants: Object.entries(jsonObj.inventory.relatedProducts).reduce((acc, [key, arr]) => [...acc, ...arr.map(v => v.value)], []),
          additionalDescBulletInfo: additionalDescBulletInfo(),
          ratingCount: reviews ? reviews.reviewCount : '',
          aggregateRating: reviews ? reviews.overallRating : '',
        };
        removeObjectToDocument(obj);
        addObjectToDocument(obj);
      }, [id, url, variantXpath]);

      await context.extract(productDetails, { transform: transformParam, type: 'APPEND' });
    };
    
    await extract();

    for (let index = 0; index < variantArray.length; index++) {
      await extract(variantArray[index]);
    };
  },
};