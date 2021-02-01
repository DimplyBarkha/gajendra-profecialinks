const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes_lg',
    transform,
    domain: 'lowes.com',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
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
