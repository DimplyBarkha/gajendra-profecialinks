const { transform } = require('../../elcorteingles/ES/transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    transform: transform,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const sectionsDiv = 'h1[id="js-product-detail-title"]';
    await context.waitForSelector(sectionsDiv, { timeout: 90000 });
    // const enhancedContent = '#tab-content-1 .js-media-holder';
    const mainURL = await context.evaluate(function () {
      console.log('main URL');
      return document.URL;
    });

    let manufacturerDescArray = [];
    let manufacturerImagesArray = [];
    const energyRating = '';
    const manufacturerDescKey = 'manufacdesc';
    const manufacturerImagesKey = 'manufacturerImages';

    const getEnhancedContentFromNavTab = async () => {
      const cssMoreInfoTab = 'div[class *= \'product_detail-attrs\'][data-type="brandTab"]';
      try {
        // wait for more info tab to load
        await context.waitForSelector(cssMoreInfoTab, { timeout: 10000 });

        // get and set manufacturerDesc to DOM
        return await context.evaluate(function (cssMoreInfoTab) {
          // getting from 'Más sobre el producto' tab
          const moreInfoTab = document.querySelector(cssMoreInfoTab);
          const isMoreInfoAvailable = moreInfoTab && moreInfoTab.innerText.toLowerCase().includes('s sobre el producto');
          console.log('isMoreInfoAvailable: ', isMoreInfoAvailable);
          if (isMoreInfoAvailable) {
            // manufacturerDesc
            const manufacturerDescDiv = document.querySelector('.flix_featdiv');
            if (manufacturerDescDiv) {
              return manufacturerDescDiv.innerText;
            } else {
              console.log('----- manufacturerDesc not loaded -----');
              return '';
            }
          }
        }, cssMoreInfoTab);
      } catch (error) {
        console.log('MoreInfoTab not laoded: ', cssMoreInfoTab);
        return '';
      }
    };

    const getManufacturerImagesFromNavTab = async () => {
      return await context.evaluate(async () => {
        // manufacturerImages
        const mfImages = document.querySelectorAll('.flix_featdiv img');
        // @ts-ignore
        const manufacturerImages = [...mfImages].map(e => e.dataset.flixsrcset.split(',')).flat();

        /**
         * if we need only one size of image from multiple imageSize available
         * const manufacturerImages = [...mfImages].map(e => e.dataset.flixsrcset.split(','))[0];
         */

        return manufacturerImages;
      });
    };

    const setValuesInDivToDOM = async (key, value) => {
      await context.evaluate(async ({ key, value }) => {
        function addElementToDocument (key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          document.body.appendChild(catElement);
        }

        addElementToDocument(key, value);
      }, { key, value });
    };

    async function enhancedContent () {
      const manufacturerDescription = await getEnhancedContentFromNavTab();
      if (manufacturerDescription) {
        manufacturerDescArray.push(manufacturerDescription);
      }

      const manufacturerImages = await getManufacturerImagesFromNavTab();
      if (manufacturerImages) {
        manufacturerImages.forEach(async (img) => {
          manufacturerImagesArray.push(img);
        });
      }
    }

    /**
     * save before navigating to any other page
     * Sometimes it loads and sometimes it doesn't. But it usually loads at the first place before any navigation
     */
    await enhancedContent();

    const getIframeUrl = async () => {
      const cssIframe = 'iframe#loadbeeTabContent,iframe#eky-dyson-iframe';

      // wait for iframe load
      try {
        await context.waitForSelector(cssIframe, { timeout: 10000 });
      } catch (error) {
        console.log('Iframe not loaded, css => ', cssIframe);
      }

      // returns additionalInfo iframe src
      const navigateLink = await context.evaluate(function (cssIframe) {
        console.log('getting navlink for Iframe');

        // gtin
        let gtin = '';

        // check if iframe loaded, get nav link

        const iframe = document.querySelector(cssIframe);
        const iframeSrc = iframe && iframe.getAttribute('src') || '';

        // if iframeSrc not available, we can generate iframe url using gtin
        if (!iframeSrc) {
          // check if gtin available in add to cart button
          const cssAddToCartButton = 'button[data-event=add_to_cart]';
          const cssAttrRequiredFromButton = 'data-product-gtin';

          const addToCartButton = document.querySelector(cssAddToCartButton);
          gtin = addToCartButton && addToCartButton.getAttribute(cssAttrRequiredFromButton) || '';
          console.log('gtin from Add to cart button: ', gtin);

          // check if gtin available in iframe sibling div
          if (!gtin) {
            const cssIframeSiblingDiv = 'data-product-gtin';
            const cssAttrRequired = 'data-loadbee-product';

            const iframeSiblingDiv = document.querySelector(cssIframeSiblingDiv);
            gtin = iframeSiblingDiv && iframeSiblingDiv.getAttribute(cssAttrRequired) || '';
            console.log('gtin from iframe sibling div: ', gtin);
          }
        }

        return iframeSrc || `https://service.loadbee.com/ean/${gtin}/es_ES?css=default&template=default&button=default#bv-wrapper`;
      }, cssIframe);

      return navigateLink;
    };

    const extractEnhancedContent = async () => {
      // manufacturerDescription
      manufacturerDescArray = await context.evaluate(async () => {
        const manufacDesc = document.querySelectorAll('body div[class*="eky-row"], #body>.wrapper');
        const arr = [];
        if ((!manufacDesc) || (manufacDesc.length === 0)) {
          console.log('we do not have anything in the body');
          return arr;
        }

        for (let i = 0; i < manufacDesc.length; i++) {
          console.log(manufacDesc[i].textContent.replace(/^\s*\n/gm, ''));
          arr.push(manufacDesc[i].textContent.replace(/^\s*\n/gm, '').trim());
        }
        console.log('manufacturerDesc is as follows - ');
        console.log(manufacDesc);
        return arr;
      });

      // manufacturerImages
      manufacturerImagesArray = await context.evaluate(async () => {
        const allImagesFromEnhancedContent = document.querySelectorAll('img');
        // @ts-ignore
        return [...allImagesFromEnhancedContent].filter(image => image.getAttribute('src')).map(image => image.src); // use of double map is an hack to avoid certail things
      });
      await context.waitForSelector('.thumbnails-slider div[data-type="picture"]').catch(() => console.log('no thumbnail present in div'));
      const extraManImages = await context.evaluate(() => {
        const extraImages = [...document.querySelectorAll('.thumbnails-slider div[data-type="picture"]')];
        const manufacturerImagesArray = [];
        for (let i = 0; i < extraImages.length; i++) {
          if (extraImages[i].getAttribute('data-img-src')) {
            manufacturerImagesArray.push(extraImages[i].getAttribute('data-img-src'));
          }
        }
        const images = manufacturerImagesArray.join(' | ');
        return images;
      });
      manufacturerImagesArray.push(extraManImages);
    };

    try {
      const navigateLink = await getIframeUrl();
      if (navigateLink) {
        console.log(navigateLink, 'Iframe Details');
        console.log('Nagivating to Enahnced content');

        await context.goto(navigateLink, {
          timeout: 20000, waitUntil: 'load', checkBlocked: true,
        });

        console.log('In Enhanced content areas');

        const txtNoEnhContAvailable = 'isn\'t any digital profile available';
        const enhancedContentPresent = await context.evaluate(async (txtNoEnhContAvailable) => {
          return !(document.querySelector('body').innerText.includes(txtNoEnhContAvailable));
        }, txtNoEnhContAvailable);

        console.log('do we have enhanced content - ' + enhancedContentPresent);

        const otherSellersTable = enhancedContentPresent ? await context.evaluate(async () => document.querySelector('body').innerHTML) : '';

        if (enhancedContentPresent) {
          console.log('got the enhanced content');
          await extractEnhancedContent();
        } else {
          console.log('enhanced content is not present - need to check if the video is present in gallery in prod page');
        }

        console.log('mainURL ' + mainURL);

        // navigate back to main url
        await context.goto(mainURL, {
          timeout: 10000,
          waitUntil: 'load',
          checkBlocked: false,
          js_enabled: true,
          css_enabled: false,
          random_move_mouse: true,
        });

        // enhancedContent from MoreInfoTab if enhancedContentPresent = false, i.e was not found earlier on the navigated page
        if (!enhancedContentPresent) {
          await enhancedContent();
        }

        // set otherSellersTable to DOM
        await context.evaluate(function (eleInnerHtml) {
          const cloneNode = document.createElement('div');
          cloneNode.style.display = 'none';
          cloneNode.setAttribute('id', 'enhancedContent');
          cloneNode.innerHTML = eleInnerHtml;
          document.body.appendChild(cloneNode);
        }, otherSellersTable);
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

    await context.evaluate(async function (energyRating) {
      const productPage = document.querySelector('h1[id="js-product-detail-title"]');
      if (!productPage) {
        console.log('ERROR: Not a Product Page');
      }

      // function to append the elements to DOM
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      addElementToDocument('energyRating', energyRating);
      // function to get the json data from the string
      function findJsonData (scriptSelector, startString, endString) {
        try {
          const xpath = `//script[contains(.,'${scriptSelector}')]`;
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          const scriptContent = element.textContent;
          const startIdx = scriptContent.indexOf(startString);
          let endIdx = scriptContent.indexOf(endString);
          let jsonStr = '';
          if (Number(endIdx) < 800) {
            endString = ';window';
            endIdx = scriptContent.indexOf(endString);
            jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
          } else {
            jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
          }
          jsonStr = jsonStr.trim();
          return JSON.parse(jsonStr);
        } catch (error) {
          console.log(error.message);
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

            // return await (await fetch(url, options)).json();
            const response = await fetch(url, options);
            if (response.status != 500) {
              return await (response).json();
            } else {
              return;
            }
          }

          // return await (await fetch(url, options)).text();
          const response = await fetch(url, options);
          if (response.status != 500) {
            return await (response).text();
          } else {
            return;
          }
        } catch (err) {
          console.log('Error while making API call.', err);
        }
      };

      const productAvailablity = '//div[contains(@class,"product_detail-purchase")]//div[contains(@class,"product_detail-add_to_cart")]//span[@class="dataholder"]/@data-json';
      const passKey = 'caBFucP0zZYZzTkaZEBiCUIK6sp46Iw7JWooFww0puAxQ';
      const availablity = findJsonObj('', productAvailablity);

      const productID = JSON.parse(availablity.snapshotItem(0).value).code_a ? JSON.parse(availablity.snapshotItem(0).value).code_a.trim('') : '';
      const sku = JSON.parse(availablity.snapshotItem(0).value).variant ? JSON.parse(availablity.snapshotItem(0).value).variant.trim('') : '';
      const storeId = JSON.parse(availablity.snapshotItem(0).value).store_id ? JSON.parse(availablity.snapshotItem(0).value).store_id.trim('') : '';

      if (productID) {
        // API
        const productsData = `https://www.elcorteingles.es/api/product/${productID}?product_id=${productID}`;
        const apiDataResponse = await makeApiCall(productsData, {});

        if (apiDataResponse) {
          // if (JSON.parse(apiDataResponse)._product_model) {
          //   document.querySelector('.sku-model').textContent = `MODELO: ${JSON.parse(apiDataResponse)._product_model}`;
          // }
          addElementToDocument('mpc', JSON.parse(apiDataResponse)._product_model);
          addElementToDocument('sku', JSON.parse(apiDataResponse).id);
          addElementToDocument('gtin', JSON.parse(apiDataResponse)._datalayer[0].product.gtin);
          addElementToDocument('retailer_product_code', JSON.parse(apiDataResponse)._datalayer[0].product.variant);
          addElementToDocument('variantInformation', (JSON.parse(apiDataResponse)._delivery_options[0] && JSON.parse(apiDataResponse)._delivery_options[0].skus[0] && JSON.parse(apiDataResponse)._delivery_options[0].skus[0].variant) ? JSON.parse(apiDataResponse)._delivery_options[0].skus[0].variant[0].value : '');
          if (JSON.parse(apiDataResponse).video && JSON.parse(apiDataResponse).video.length > 0) {
            console.log('we have the video array in the api response');
            if (JSON.parse(apiDataResponse).video[0].url) {
              console.log('we have url in the video array');
              addElementToDocument('thumbnailVideo', JSON.parse(apiDataResponse).video[0].url);
            } else {
              console.log('there is no url in the video array');
            }
          } else {
            console.log('There is no video in the api response');
          }
        }
      }

      if (productID) {
        // Number of reviews and rating
        const reviewData = `https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=${passKey}&productid=${productID}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=es_ES`;
        const apiReviewResponse = await makeApiCall(reviewData, {});
        const responseRatingCount = JSON.parse(apiReviewResponse) ? JSON.parse(apiReviewResponse).reviewSummary.numReviews : ratingFromDOM();
        const responseReviewRating = JSON.parse(apiReviewResponse) ? parseFloat(JSON.parse(apiReviewResponse).reviewSummary.primaryRating.average).toFixed(1).replace('.', ',')
          : '';
        addElementToDocument('ratingCount', responseRatingCount);
        addElementToDocument('aggregateRating', responseReviewRating);
      }

      const imageData = findJsonObj('image');
      // Check for the data and append to DOM
      if (imageData) {
        const checkImage = imageData.image.slice(-1)[0];
        addElementToDocument('product_image', typeof (checkImage) === 'string' && checkImage.includes('https://') ? checkImage : `https:${imageData.image.slice(-1)[0]}`);
        addElementToDocument('product_description', imageData.description);
      }

      // elements from data Layer object
      const dataObj = findJsonData('dataLayer', '=', ';');
      // Check for the data and append to DOM
      if (dataObj) {
        if (dataObj[0].product) {
          if (dataObj[0].product.status.toLowerCase() === 'available' || dataObj[0].product.status.toLowerCase() === 'add') {
            addElementToDocument('availability', 'In Stock');
          } else {
            addElementToDocument('availability', 'Out Of Stock');
          }
          // Check for the brand  and append to DOM
          if (dataObj[0].product.brand) {
            addElementToDocument('brand', dataObj[0].product.brand);
          }

          // Check for the brand  and append to DOM
          if (dataObj[0].product.gtin) {
            addElementToDocument('gtin', dataObj[0].product.gtin);
          }

          // Check for the brand  and append to DOM
          if (dataObj[0].product.brand) {
            addElementToDocument('retailer_product_code', dataObj[0].product.id);
          }

          // Check for the sku  and append to DOM
          if (dataObj[0].product.code_a) {
            addElementToDocument('sku', dataObj[0].product.code_a);
          }

          // Check for List Price
          if (Number(dataObj[0].product.price.o_price) === Number(dataObj[0].product.price.f_price)) {
            addElementToDocument('listPrice', '');
          } else {
            if (dataObj[0].product.price.o_price) {
              addElementToDocument('listPrice', dataObj[0].product.price.o_price.toString().replace('.', ','));
            } else {
              if (dataObj[0].product.price.original) {
                addElementToDocument('listPrice', dataObj[0].product.price.original.toString().replace('.', ','));
              } else {
                addElementToDocument('listPrice', '');
              }
            }
          }

          // Check for  Price
          if (dataObj[0].product.price.o_price) {
            addElementToDocument('price', dataObj[0].product.price.f_price.toString().replace('.', ','));
          } else {
            if (dataObj[0].product.price.final) {
              addElementToDocument('price', dataObj[0].product.price.final.toString().replace('.', ','));
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

      function getPathDirections (xpathToExecute) {
        var result = [];
        var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
          result.push(JSON.parse(nodesSnapshot.snapshotItem(i).textContent));
        }
        return result;
      }

      function videoData (data) {
        if (data[0].playlist.length > 1) {
          return data[0].playlist.map(e => { return 'https:' + e.file; }).join(' | ');
        }

        if (data[0].playlist.length === 1) {
          return data.map(e => { return 'https:' + e.playlist[0].file; }).join(' | ');
        }
      }
      const videos = getPathDirections('//div[contains(@class,"fullJwPlayerWarp")]/input/@value').length > 0 ? videoData(getPathDirections('//div[contains(@class,"fullJwPlayerWarp")]/input/@value')) : '';

      const apluseImages = getPathDirections('//div[contains(@class,"fullJwPlayerWarp")]/input/@value').length > 0 ? getPathDirections('//div[contains(@class,"fullJwPlayerWarp")]/input/@value').map(e => { return e.playlist.length > 1 ? e.playlist.map(i => { return 'https:' + i.image; }) : 'https:' + e.playlist[0].image; }).join(' | ') : '';

      // getting video from more from product section
      const videoSelector2 = 'div[class*="inpage_selector_video"] input';
      const videoSelectorNode = document.querySelector(videoSelector2);
      if (videoSelectorNode && videoSelectorNode.hasAttribute('value')) {
        let data = videoSelectorNode.getAttribute('value');
        data = JSON.parse(data);
        if (data.playlist && data.playlist.length > 0) {
          data.playlist.forEach(q => {
            if (q.file) {
              addElementToDocument('video', q.file.replace(/(https:|http:)?(.+)/g, 'https:$2'));
            }
          });
        }
      }

      // addElementToDocument('videos', videos);
      addElementToDocument('apluseImages', apluseImages);
      // Secondry Image
      const alternateImages = [];
      document.querySelectorAll('link[as=image]').forEach(e => {
        alternateImages.push(e.href);
      });
      addElementToDocument('alternateImages', alternateImages.slice(1).join(' | ').replace(/210x210/gm, '1200x1200'));
      // Specifications
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

      // zoom Image

      const ZoomImage = '//img/@data-zoom';
      findJsonObj('', ZoomImage);
      if (findJsonObj('', ZoomImage).snapshotLength > 0) {
        addElementToDocument('imageZoomFeaturePresent', 'Yes');
      } else {
        addElementToDocument('imageZoomFeaturePresent', 'No');
      }

      // Get the ratingCount
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
      } allergyAdvice();

      // Function to remove the `\n` from the textContent
      function textContent (element, attributeName) {
        const text = (element && element.innerText.trim()
          .split(/[\n]/)
          .filter((ele) => ele)
          .join(' ')) ||
          '';
        addElementToDocument(attributeName, text);
      }

      textContent(document.querySelectorAll('div.pdp-info-container div.info')[1], 'ingredient');
    }, energyRating);

    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        async function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              console.log('waiting!!');
              resolve();
            }, ms);
          });
        }
        let scrollTop = 0;
        while (scrollTop !== 15000) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          console.log('scrolling now!!');
          if (scrollTop === 15000) {
            await stall(3000);
            break;
          }
        }
      });
    };

    await applyScroll(context);

    // gets videos
    await context.evaluate(async () => {
      async function addElementToDocumentAsync (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        document.body.appendChild(catElement);
      }
      const videoElms = document.querySelectorAll('input[value*="videos"]');
      let allVidLinks = [];
      if (videoElms && (videoElms.length > 0)) {
        console.log('we have ' + videoElms.length + ' videos');
        for (let i = 0; i < videoElms.length; i++) {
          let link = '';
          if (videoElms[i].hasAttribute('value')) {
            const videoText = videoElms[i].getAttribute('value');
            let jsonObj = [];
            try {
              jsonObj = JSON.parse(videoText);
            } catch (err) {
              console.log('got some error while parsing string to json - ' + err.message);
            }
            if (Array.isArray(jsonObj)) {
              console.log('nothing can be done');
            } else {
              const thisObj = { ...jsonObj };
              if (thisObj.hasOwnProperty('playlist') && Array.isArray(thisObj.playlist)) {
                if (thisObj.playlist[0].hasOwnProperty('file')) {
                  link = 'https:' + thisObj.playlist[0].file;
                  console.log(link);
                  allVidLinks.push(link);
                } else {
                  console.log('we do not have file');
                }
              } else {
                console.log('either we do not have playlist -- or that playlist is not an array anymore');
              }
            }
          } else {
            console.log('we do not have value');
          }
        }
        const videoJson = document.querySelector('input[value*="videos"]') && document.querySelector('input[value*="videos"]').hasAttribute('value') ? document.querySelector('input[value*="videos"]').getAttribute('value') : null;
        if (videoJson) {
          const encodedUri = encodeURIComponent(videoJson);
          const Produrl = document.URL.replace(/(https:\/\/)(.+)/g, '$2');
          const gtin = document.querySelector('[data-product-gtin]') && document.querySelector('[data-product-gtin]').hasAttribute('data-product-gtin') ? document.querySelector('[data-product-gtin]').getAttribute('data-product-gtin') : null;
          let videoUrl = '';
          if (videoJson && gtin && Produrl) {
            videoUrl = `https://media.flixcar.com/delivery/static/jwplayer/jwiframe.html?fjw=${encodedUri}&l=es&ean=${gtin}&sid=&base=//media.flixcar.com&pn=https|dub|for${Produrl}`;
            await addElementToDocumentAsync('galleryVideo', videoUrl);
          } else {
            console.log('no gallery videos');
          }
        } else {
          console.log('we do not have any text in value');
        }
      } else {
        console.log('we do not have any inputs where value attr contains video - hence no video');
      }
      const videoSet = new Set(allVidLinks);
      allVidLinks = Array.from(videoSet);
      await addElementToDocumentAsync('allVidLinks', allVidLinks.join(' || '));
    });

    // adds manufacturerDesc to DOM
    if (manufacturerDescArray.length) {
      await context.evaluate(async (manufacturerDesc, manufacturerDescKey) => {
        async function addElementToDocumentAsync (key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          document.body.appendChild(catElement);
        }

        await addElementToDocumentAsync(manufacturerDescKey, manufacturerDesc.join(' || '));
      }, manufacturerDescArray, manufacturerDescKey);
    }

    // adds manufacturerDesc to DOM
    if (manufacturerImagesArray.length) {
      // @ts-ignore
      const uniqueImages = [...new Set(manufacturerImagesArray)];

      await context.evaluate(async (manufacturerImagesArray, manufacturerImagesKey) => {
        async function addElementToDocument (key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          document.body.appendChild(catElement);
        }

        manufacturerImagesArray.forEach((image) => {
          addElementToDocument(manufacturerImagesKey, image.replace(/([0-9w])+$/, '')); // removes 800w | 400w | 200w etc from image if available
        });
      }, uniqueImages, manufacturerImagesKey);
    }

    await context.extract(productDetails, { transform });
  },
};
