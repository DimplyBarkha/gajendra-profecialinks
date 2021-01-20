const { transform } = require('./format.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    transform: transform,
    domain: 'lowes.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const isStorePresent = await context.evaluate(async function () {
      const isStorePresent = document.querySelector('#store-search-handler');
      // @ts-ignore
      return isStorePresent ? !!isStorePresent.innerText.trim().includes('Burbank Lowe') : false;
    });
    try {
      console.log('Is store present-->', isStorePresent);
      if (!isStorePresent) {
        await context.waitForSelector('span#store-search-handler');
        await context.evaluate(async function () {
          const storeButton = document.querySelector('span#store-search-handler');
          if (storeButton) {
            // @ts-ignore
            storeButton.click();
          }
        });
        await context.evaluate(async function () {
          const inputElement = document.querySelector('input[class*="type--text incomplete"]');
          inputElement && inputElement.setAttribute('value', 'Burbank Lowe');
        });
        await context.waitForSelector('input[value*="Burbank Lowe"]');
        await context.evaluate(async function () {
          const formButton = document.querySelector('form button[class*="variant--primary"]');
          // @ts-ignore
          formButton && formButton.click();
        });

        await context.waitForSelector('ul[class*="styles__StoreListWrapper"] li button[class*="variant--primary"]');
        await context.evaluate(async function () {
          const selectButton = document.querySelector('ul[class*="styles__StoreListWrapper"] li button[class*="variant--primary"]');
          // @ts-ignore
          selectButton && selectButton.click();
        });
        await context.waitForNavigation();
      }
    } catch (error) {
      console.log('Faild to set store location', error);
    }
    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('div#footerApp');
      // @ts-ignore
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 1000;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('div#footerApp');
        // @ts-ignore
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      try {
        const button = document.querySelector('div[id="preview-specifications"] div[class*="preview-btn"] button');
        // @ts-ignore
        button && button.click();
      } catch (error) {
        console.log('failed to click view all spec');
      }
    });
    await context.evaluate(async function () {
      const images = JSON.parse(document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent &&
                document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/"additionalImages":([^\]]+])/) &&
                document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/"additionalImages":([^\]]+])/)[1]);
      const alternateImagesCount = images ? images.length : null;
      if (alternateImagesCount) {
        images.map(ele => {
          const secondaryImageLink = document.createElement('a');
          secondaryImageLink.setAttribute('class', 'alternateImages');
          secondaryImageLink.setAttribute('href', ele.baseUrl);
          document.body.appendChild(secondaryImageLink);
        });
        const secondaryImageCount = document.createElement('a');
        secondaryImageCount.setAttribute('class', 'alternateImagesCount');
        secondaryImageCount.setAttribute('href', alternateImagesCount);
        document.body.appendChild(secondaryImageCount);
      }

      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const enhancedContent = document.querySelector('div[class*="syndi_powerpage"]');
      try {
        if (enhancedContent) {
          // @ts-ignore
          const witbData = Array.from([...enhancedContent.shadowRoot.querySelectorAll('[class="syndigo-widget-section-header"]')].find(elm => elm.innerText.match(/in the box/i)).nextElementSibling.querySelectorAll('[class="syndigo-featureset-feature"]'));
          witbData.forEach(element => {
            element.querySelector('h3') && addElementToDocument('witbText', element.querySelector('h3').innerText);
            element.querySelector('img') && addElementToDocument('witbImg', element.querySelector('img').src);
          });
        }
        const comparisonTable = document.querySelector('div[class*="syndi_powerpage"]');
        if (comparisonTable) {
          // @ts-ignore
          const witbData1 = [...comparisonTable.shadowRoot.querySelectorAll('div[class="syndi_powerpage"] div[class*="syndigo"]')];
          witbData1.forEach(element => {
            element.querySelector('h2[class="syndigo-widget-section-header"]') && addElementToDocument('witbTable', element.querySelector('h2[class="syndigo-widget-section-header"]'));
          });
        }
      } catch (error) {
        console.log(error);
      }

      // const expandDataT = document.querySelector('div[class="prev-container"]>div[class="prev-body"] div[class="divTableRow"]:first-child div[class="optionCont"]');
      // if (expandDataT) {
      //   let witbData1 = expandDataT.querySelectorAll('a');
      //   let finalValue;
      //   witbData1.forEach(element => {
      //     if (element.querySelector('b').innerText.match(/dyson/i)) {
      //       finalValue = 'Yes';
      //     }
      //     else {
      //       finalValue = 'No';
      //       return false;
      //     }
      //   });

      //   addElementToDocument('elementDataT', finalValue);
      // }
      //   console.log(document.querySelector('b').innerText == 'Dyson');
      //   console.log(document.querySelector('b').innerText.match(/dyson/i));
      try {
        const videoApi = JSON.parse(document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent &&
                    document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/videos":([^\]]+])/) &&
                    document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/videos":([^\]]+])/)[1]);
        if (videoApi && videoApi.length) {
          videoApi.map(ele => {
            const newlink = document.createElement('a');
            newlink.setAttribute('class', 'videoUrls');
            newlink.setAttribute('href', `https://lda.lowes.com/is/content/Lowes/${ele}`);
            document.body.appendChild(newlink);
          });
        }
      } catch (error) {
        console.log('Video fetch: ', error);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
