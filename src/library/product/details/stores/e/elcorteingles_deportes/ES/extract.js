const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    transform,
    domain: 'elcorteingles.es',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const sectionsDiv = 'h1[id="js-product-detail-title"]';
    await context.waitForSelector(sectionsDiv, { timeout: 90000 });

    const mainURL = await context.evaluate(function () {
      console.log('main URL');
      return document.URL;
    });

    // navigation to iframe
    const iframeSelector = '#loadbeeTabContent';
    try {
      console.log(`Waiting for iframeSelector: ${iframeSelector}`);
      await context.waitForSelector(iframeSelector, { timeout: 50000 });
    } catch (error) {
      console.log(`iframeSelector: ${iframeSelector} not found`);
      console.log(error);
    }

    try {
      const navigateLink = await context.evaluate(function (iframeSelector) {
        console.log('getting navlink');
        return document.querySelector(iframeSelector) && document.querySelector(iframeSelector).getAttribute('src');
      }, iframeSelector);

      if (navigateLink) {
        console.log(navigateLink, 'Iframe Details');
        console.log('Nagivating to Enahnced content');

        await context.goto(navigateLink, {
          timeout: 20000,
          waitUntil: 'load',
          checkBlocked: true,
        });

        console.log('In Enhanced content areas');

        const otherSellersTable = await context.evaluate(function () {
          return document.querySelector('.container').innerHTML;
        });

        const manufacturerDescription = await context.evaluate(function () {
          return document.querySelector('.container').innerText;
        });

        const manufacturerImages = await context.evaluate(function () {
          return [...document.querySelectorAll('img')].map(img => img.src).filter(Boolean).join(' | ');
        });

        console.log('Got otherSellersTable here');
        console.log('mainURL' + mainURL);

        await context.goto(mainURL, {
          timeout: 10000,
          waitUntil: 'load',
          checkBlocked: false,
          js_enabled: true,
          css_enabled: false,
          random_move_mouse: true,
        });

        // adding innerHtml of iframe to DOM
        await context.evaluate(function (eleInnerHtml) {
          const cloneNode = document.createElement('div');
          cloneNode.setAttribute('id', 'enhancedContentFromIframe');
          cloneNode.innerHTML = eleInnerHtml;
          document.querySelector('div.product_detail-description-in-image').appendChild(cloneNode);
        }, otherSellersTable);

        await context.evaluate(function (value) {
          const { manufacturerDescription, manufacturerImages } = value;

          function addElementToDocument (key, value) {
            const catElement = document.createElement('div');
            catElement.id = key;
            catElement.textContent = value;
            catElement.style.display = 'none';
            document.body.appendChild(catElement);
          }

          // manufacturerDescription
          console.log(`manufacturerDescription: ${manufacturerDescription}`);
          addElementToDocument('manufacturerDescription', manufacturerDescription);

          // manufacturerImage
          console.log(`manufacturerImages: ${manufacturerImages}`);
          addElementToDocument('manufacturerImages', manufacturerImages);
        }, {
          manufacturerDescription: manufacturerDescription,
          manufacturerImages: manufacturerImages,
        });
      }
    } catch (err) {
      console.log('Additional other sellers error -' + JSON.stringify(err));
      await context.goto(mainURL, {
        timeout: 10000,
        waitUntil: 'load',
        checkBlocked: false,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
    }

    try {
      await context.waitForSelector('#enhancedContentFromIframe', { timeout: 30000 });
    } catch (err) {
      console.log('Manufacturer details did not load.');
    }

    try {
      await context.evaluate(async function () {
        // function to append the elements to DOM
        function addElementToDocument (key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }

        // function to get the json data from the string
        function findJsonData (scriptSelector, startString, endString) {
          try {
            const xpath = `//script[contains(.,'${scriptSelector}')]`;
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const scriptContent = element.textContent;
            const startIdx = scriptContent.indexOf(startString);
            const endIdx = scriptContent.indexOf(endString);
            let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
            jsonStr = jsonStr.trim();
            return JSON.parse(jsonStr);
          } catch (error) {
            console.log('Failed to find JSON Data ', error.message);
          }
        }

        // function to get the json data from the textContent
        function findJsonObj (scriptSelector, video) {
          if (video) {
            var result = document.evaluate(video, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            return result;
          } else {
            try {
              const xpath = `//script[contains(.,'${scriptSelector}')]`;
              const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              let jsonStr = element.textContent;
              jsonStr = jsonStr.trim();
              return JSON.parse(jsonStr);
            } catch (error) {
              console.log(error.message);
            }
          }
        }

        const makeApiCall = async (url, options) => {
          try {
            console.log(`Making API call to => ${url}`);
            if (!options) {
              options = {
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
              };

              return await (await fetch(url, options)).json();
            }

            return await (await fetch(url, options)).text();
          } catch (err) {
            console.log('Error while making API call.', err);
          }
        };

        function setAttributes (el, attrs) {
          for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
          }
        }

        const imageData = findJsonObj('image');
        // Check for the data and append to DOM
        if (imageData) {
          addElementToDocument('product_image', `${imageData.image.length === 0 ? '' : 'https:'}${imageData.image.slice(-1)[0] === undefined ? '' : imageData.image.slice(-1)[0]}`);
          addElementToDocument('product_description', imageData.description);
        } else {
          const sliderImage = document.querySelectorAll('.image-layout-slides-group div')[0].querySelector('img').getAttribute('src');
          const linkImage = document.querySelectorAll('link[as="image"]')[0].getAttribute('href');
          if (sliderImage) {
            console.log('slider here');
            addElementToDocument('product_image', `https:${sliderImage}`);
          } else {
            console.log('link here');
            addElementToDocument('product_image', `https:${linkImage}`);
          }
        }

        const getXpath = (xpath, prop) => {
          const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
          let result;
          if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
          else result = elem ? elem.singleNodeValue : '';
          return result && result.trim ? result.trim() : result;
        };

        function nameExtended () {
          const getXpath = (xpath, prop) => {
            const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
            let result;
            if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
            else result = elem ? elem.singleNodeValue : '';
            return result && result.trim ? result.trim() : result;
          };

          const name = getXpath('//h1[@id="js-product-detail-title"]', 'textContent') ? getXpath('//h1[@id="js-product-detail-title"]', 'textContent') : '';
          return name;
        }

        // Directions

        function getPathDirections (xpathToExecute) {
          var result = [];
          var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
            result.push(nodesSnapshot.snapshotItem(i).textContent);
          }
          return result;
        }
        const directions = getPathDirections('//div[contains(@class,"product_detail-description-in-image")]/strong[contains(text(),"Modo de aplicación:") or contains(text(),"Modo de")]/following-sibling::p | //dt[contains(text(),"Modo de")]/following-sibling::dd[1] | //strong[contains(text(),"Modo")]/following-sibling::* | //div[contains(@class,"product_detail-description")]//p[contains(.,"Modo de")]/following-sibling::p');
        addElementToDocument('directions', directions ? directions.join(' ') : '');

        // For FirstVariant
        const firstVariant = getXpath('//div[@id="variants_container"]//select//option[@color][1]/@value', 'nodeValue');
        addElementToDocument('firstVariant', firstVariant);

        // elements from data Layer object
        const dataObj = findJsonData('dataLayer', '=', ';');
        // Check for the data and append to DOM
        if (dataObj) {
          if (dataObj[0].product) {
            if (dataObj[0].product.brand) {
              addElementToDocument('brand', dataObj[0].product.brand);
            }

            // Check for List Price
            if (Number(dataObj[0].product.price.o_price) === Number(dataObj[0].product.price.f_price)) {
              addElementToDocument('listPrice', '');
            } else {
              if (dataObj[0].product.price.o_price) {
                addElementToDocument('listPrice', dataObj[0] && dataObj[0].product && dataObj[0].product.price && dataObj[0].product.price.o_price ? dataObj[0].product.price.o_price.toString().replace('.', ',') : '');
              } else {
                if (dataObj[0].product.price.original) {
                  addElementToDocument('listPrice', dataObj[0] && dataObj[0].product && dataObj[0].product.price && dataObj[0].product.price.original ? dataObj[0].product.price.original.toString().replace('.', ',') : '');
                } else {
                  addElementToDocument('listPrice', '');
                }
              }
            }

            // Check for  Price
            if (dataObj[0].product.price.o_price) {
              addElementToDocument('price', dataObj[0] && dataObj[0].product && dataObj[0].product.price && dataObj[0].product.price.f_price ? dataObj[0].product.price.f_price.toString().replace('.', ',') : '');
            } else {
              if (dataObj[0].product.price.final) {
                addElementToDocument('price', dataObj[0] && dataObj[0].product && dataObj[0].product.price && dataObj[0].product.price.final ? dataObj[0].product.price.final.toString().replace('.', ',') : '');
              } else {
                addElementToDocument('price', '');
              }
            }

            // Check for the product id  and append to DOM
            if (dataObj[0].product.id) {
              if (dataObj[0].product.id.match(/[0-9](.*)___/)) {
                const retailerProductCode = dataObj[0].product.id.match(/[0-9](.*)___/)[1];
                addElementToDocument('retailer_product_code', retailerProductCode);
              }
            }
          }
        }

        function variantInformation (variantsData) {
          if (variantsData.variant[1]) {
            if (variantsData.variant[0]) {
              return variantsData.variant[0].value + '-' + variantsData.variant[1].value;
            }
          } else {
            return variantsData.variant[1] ? variantsData.variant[1].value : '' + '' + variantsData.variant[0] ? variantsData.variant[0].value : '';
          }
        }

        function getStock (variants) {
          if (variants) {
            if (variants.status.toLocaleLowerCase() === 'add') {
              return 'In Stock';
            } else if (variants.status.toLocaleLowerCase() === 'available') {
              return 'In Stock';
            } else if (variants.status.toLocaleLowerCase() === 'mixed') {
              return 'In Stock';
            } else {
              return 'Out Of Stock';
            }
          } else {
            return 'Out Of Stock';
          }
        }

        // Number of reviews and rating
        const passKey = 'caBFucP0zZYZzTkaZEBiCUIK6sp46Iw7JWooFww0puAxQ';
        const productAvailablity = '//div[contains(@class,"product_detail-purchase")]//div[contains(@class,"product_detail-add_to_cart")]//span[@class="dataholder"]/@data-json';
        const productID = findJsonObj('', productAvailablity).snapshotItem(0).value ? JSON.parse(findJsonObj('', productAvailablity).snapshotItem(0).value).code_a.trim('') : '';
        const sku = findJsonObj('', productAvailablity).snapshotItem(0).value ? JSON.parse(findJsonObj('', productAvailablity).snapshotItem(0).value).variant.trim('') : '';
        const storeId = findJsonObj('', productAvailablity).snapshotItem(0).value ? JSON.parse(findJsonObj('', productAvailablity).snapshotItem(0).value).store_id.trim('') : '';

        const reviewData = `https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=${passKey}&productid=${productID}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=es_ES`;
        const apiReviewResponse = await makeApiCall(reviewData, {});
        const responseRatingCount = JSON.parse(apiReviewResponse) ? JSON.parse(apiReviewResponse).reviewSummary.numReviews : ratingFromDOM();
        const responseReviewRating = JSON.parse(apiReviewResponse) ? parseFloat(JSON.parse(apiReviewResponse).reviewSummary.primaryRating.average).toFixed(1).replace('.', ',')
          : '';
        addElementToDocument('ratingCount', responseRatingCount);
        addElementToDocument('aggregateRating', responseReviewRating);

        const productsData = `https://www.elcorteingles.es/api/product/${productID}?product_id=${productID}&store_id=${storeId}&original_store=${storeId}`;
        const apiDataResponse = await makeApiCall(productsData, {});
        addElementToDocument('SKU', JSON.parse(apiDataResponse).id);
        addElementToDocument('mpc', JSON.parse(apiDataResponse)._product_model);
        addElementToDocument('promotion', JSON.parse(apiDataResponse).discount ? '-' + JSON.parse(apiDataResponse).discount + '%' : '');

        // Append a UL and LI tag append the variant info in the DOM
        const variants = JSON.parse(apiDataResponse).skus;
        console.log(variants, 'Data');
        const targetElement = document.querySelector('body');
        const newUl = document.createElement('ul');
        newUl.id = 'variantsadd';
        targetElement.appendChild(newUl);

        const ul = document.querySelector('#variantsadd');
        const name = nameExtended(); // same for all variant

        const variantIds = [];
        variants.forEach(q => {
          if (q.reference_id) {
            variantIds.push(q.reference_id.trim());
          }
        });
        try {
          if (variants.length) {
            for (let i = 0; i < variants.length; i++) {
              const listItem = document.createElement('li');
              const variantInfo = {
                nameExtended: name,
                color: variants[i].color.title,
                gtin: variants[i].gtin, // eangtin
                retailer_product_code: variants[i].reference_id,
                variantinformation: variantInformation(variants[i]), // variantInformation,
                variantDetails: variantIds.join(' | '), // variants
                variantcount: variants.length, // variantCount
                availability: getStock(variants[i]), // availabilityText
              };
              console.log(`variantInfo: ${JSON.stringify(variantInfo)}`);

              setAttributes(listItem, variantInfo);
              ul.appendChild(listItem);
            }
          }
        } catch (err) {
          console.log(err, 'api');
          throw 'API Needs a change';
        }

        function ratingFromDOM () {
          const reviewsCount = document.querySelector('div.bv-content-pagination-pages-current');
          let ratingCount;
          if (reviewsCount) {
            ratingCount = reviewsCount.textContent.trim().match(/[^\s]+(?=\sOpiniones)/);
            if (ratingCount) {
              return ratingCount[0];
            }
          } else if (document.querySelector('h4[itemprop="headline"]')) {
            ratingCount = document.querySelector('h4[itemprop="headline"]').textContent.trim().match(/\d+/);

            if (ratingCount) {
              if (document.querySelector('li[itemprop="review"]')) {
                ratingCount = parseInt(ratingCount[0]) + document.querySelectorAll('li[itemprop="review"]').length;
              }
              return ratingCount;
            }
          } else if (document.querySelector('li[itemprop="review"]')) {
            ratingCount = document.querySelectorAll('li[itemprop="review"]').length;
            if (ratingCount) {
              return ratingCount;
            }
          }
        }

        function allergyAdvice () {
          const xpath = '//*[contains(text(),"Ingredientes y alérgensos")]/../ul/li';
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (element) {
            const allElements = [...element.querySelectorAll('b')];
            const allergyAdvice = allElements.map(i => i.textContent).join(' ');
            addElementToDocument('allergyAdvice ', allergyAdvice);
          }
        }
        allergyAdvice();

        // Function to remove the `\n` from the textContent
        function textContent (element, attributeName) {
          const text = (element && element.innerText.trim()
            .replace(' ', '\n')
            .split('\n')
            .filter((ele) => ele)
            .join(' ')) ||
                        '';
          addElementToDocument(attributeName, text);
        }

        const description = document.querySelector('.product_detail-description-in-image');
        textContent(description, 'bulletDescription');
        textContent(document.querySelectorAll('div.pdp-info-container div.info')[1], 'ingredient');

        // Specifications
        const specifcations = [];
        const specXpath = document.querySelectorAll('#tab-content-0 > div > dl > div');
        if (specXpath.length > 0) {
          specXpath.forEach(e => {
            specifcations.push(`${Array.from(e.children, ({ textContent }) => textContent).filter(Boolean)} `);
          });
          addElementToDocument('bulletDescription', specifcations.join(' ').replace(/\,/g, ' '));
        } else {
          specXpath.forEach(e => {
            specifcations.push(`${Array.from(e.children, ({ textContent }) => textContent).filter(Boolean)}`);
          });
          addElementToDocument('bulletDescription', specifcations.join(' ').replace(/\,/g, ' '));
        }
      });
    } catch (error) {
      console.log('Evaluation Failed', error);
    }

    await context.extract(productDetails, { transform });
  },
};
