const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'ozon',
    transform,
    domain: 'ozon.ru',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.setJavaScriptEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setCssEnabled(true);
    try {
      await context.waitForXPath('//div[contains(@id, "state-searchResults")]');
    } catch (e) {
      console.log('state-searchResults not loaded');
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));
    await context.evaluate(async () => {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(200);
        scrollTop += 4000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(4000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function parseId (idText) {
        const firstMatch = idText.match(/id\/\d{0,}/g);
        const secondMatch = idText.match(/-\d*\//g);
        if (firstMatch) {
          return firstMatch[0].replace(/\D/g, '');
        } else if (secondMatch) {
          return secondMatch[0].replace(/\D/g, '');
        } else {
          return idText;
        }
      }

      // Thumbnails from JSON
      // Get data from JSON
      const dataStateDivs = document.querySelectorAll('div[data-state]');
      let thumbObj = {};
      dataStateDivs.forEach(dataStateDiv => {
        if (dataStateDiv.id.includes('tate-searchResultsV2')) {
          thumbObj = JSON.parse(dataStateDiv.getAttribute('data-state'));
        }
      });
      // Add urls from obj to array
      const thumbsArr = [];
      const brandsArr = [];
      if (thumbObj.items) {
        // Loop for each elem
        thumbObj.items.forEach((elem, i) => {
          // Take thumb url
          const thumbUrl = elem.images[0];
          const brand = elem.cellTrackingInfo.brand ? elem.cellTrackingInfo.brand : '';
          brandsArr.push(brand);
          thumbsArr.push(thumbUrl);
        });
      };
      // Add fror each element arrtibute with url
      const mainUrl = window.location.href;
      const searchInput = document.querySelector('.b7i5') ? document.querySelector('.b7i5').getAttribute('value') : '';
      const cardsItems = document.querySelectorAll('.ao4>div, .b6o3>div');
      if (cardsItems) {
        cardsItems.forEach((item, index) => {
          try {
            const itemDescr = item.querySelector('.a2g0');
            if (itemDescr && item.className) {
              // Getting src to image from attr or from parsed array
              const itemImg = item.querySelector('img');
              let itemLink;
              let itemImgSrcAttr;
              if (itemImg) {
                itemImgSrcAttr = itemImg.getAttribute('src');
              }
              const itemImgSrc = thumbsArr[index] || itemImgSrcAttr;
              const brandName = brandsArr[index] || '';
              // Getting link to product. Some products dosen't have <a> tag with href
              if (item.querySelector('div[tilelink]')) {
                const itemUrlTitle = item.querySelector('div[tilelink]');
                itemLink = itemUrlTitle.getAttribute('tilelink');
              } else if (item.querySelector('a.a2g0')) {
                const itemUrlTitle = item.querySelector('a.a2g0');
                itemLink = itemUrlTitle.getAttribute('href');
              }
              const itemId = parseId(itemLink);
              // Setting attrs with values
              itemDescr.setAttribute('oz-brand', brandName);
              itemDescr.setAttribute('oz-url', mainUrl);
              itemDescr.setAttribute('oz-input', searchInput);
              itemDescr.setAttribute('oz-tilelink', itemLink);
              // If photos didn't load fetch them from API
              if (!itemImgSrc.includes('no_photo')) {
                itemDescr.setAttribute('oz-thumbnail', itemImgSrc);
              } else {
                fetch(`https://www.ozon.ru/api/composer-api.bx/page/json/v2?url=/context/detail/id/${itemId}`)
                  .then((response) => {
                    return response.json();
                  })
                  .then((data) => {
                    for (const property in data.widgetStates) {
                      if (property.includes('webGallery-')) {
                        const imgData = data.widgetStates[`${property}`];
                        return imgData;
                      }
                    }
                  })
                  .then(imgData => {
                    const imgDataParsed = JSON.parse(imgData);
                    const imgDataSrc = imgDataParsed.coverImage ? imgDataParsed.coverImage : 'https://cdn1.ozone.ru/graphics/new_no_photo.png';
                    itemDescr.setAttribute('oz-thumbnail', imgDataSrc);
                    itemDescr.setAttribute('oz-thumbnail-fatched', 'true');
                  });
              }
            }
          } catch (e) {
            console.log(`Error at item - ${item}, index - ${index}, error - ${e}`);
            addElementToDocument('oz-error', `Error at item - ${item}, index - ${index}, error - ${e}`);
          }
        });
      };
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));

    const cssHiddenImage = 'div.q8';
    const xpathAgeConfirmation = "//div[contains(text(),'Подтвердить')]";
    const isSelectorAvailable = async (cssSelector) => {
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };
    const hiddenImage = await isSelectorAvailable(cssHiddenImage);
    if (hiddenImage) {
      await context.click(cssHiddenImage);
    }
    try {
      await context.waitForXPath(xpathAgeConfirmation, { timeout: 5000 });
    } catch (e) {
      console.log('age confirmation popup not loaded');
    }

    await context.evaluate(async function () {
      const confirmAge = document.evaluate("//div[contains(text(),'Подтвердить')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (confirmAge) {
        confirmAge.click();
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return await context.extract(productDetails, { transform });
  },
};
