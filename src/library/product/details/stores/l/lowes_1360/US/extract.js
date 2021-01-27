const { transform } = require('../format.js');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes_1360',
    transform,
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
    // await context.evaluate(async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 5000));

    //   async function infiniteScroll () {
    //     let prevScroll = document.documentElement.scrollTop;
    //     while (true) {
    //       window.scrollBy(0, document.documentElement.clientHeight);
    //       await new Promise(resolve => setTimeout(resolve, 1000));
    //       const currentScroll = document.documentElement.scrollTop;
    //       if (currentScroll === prevScroll) {
    //         break;
    //       }
    //       prevScroll = currentScroll;
    //     }
    //   }
    //   await infiniteScroll();
    // });
    async function scrollToRec(node, time) {
      await context.evaluate(async (node, time) => {
        const element = document.querySelector(node) || null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, time);
          });
        }
      }, node, time);
    }
    await scrollToRec('div#footerApp', 8000);
    await scrollToRec('header', 2000);
    await scrollToRec('div.recommendation-wrapper', 5000);
    try {
      await context.waitForSelector('div.recommendation-wrapper div.product-card', { timeout: 25000 });
    } catch (e) {
      await scrollToRec('header', 10000);
      await scrollToRec('div#footerApp', 10000);
      await scrollToRec('div.eppSection', 5000);
      await scrollToRec('div.recommendation-wrapper', 5000);
      console.log('Not loading recommended products');
    }
    await context.evaluate(async function () {
      // let scrollSelector = document.querySelector('div#footerApp');
      // // @ts-ignore
      // let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      // let yPos = 0;
      // while (scrollLimit && yPos < scrollLimit) {
      //   yPos = yPos + 1000;
      //   window.scrollTo(0, yPos);
      //   scrollSelector = document.querySelector('div#footerApp');
      //   // @ts-ignore
      //   scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      //   await new Promise(resolve => setTimeout(resolve, 1000));
      // }
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
    async function addWitbandCRT() {
      async function getWitbAndComparison() {
        if (Array.from(document.querySelectorAll('div[class="modelNo"] > span')).length) {
          const id = Array.from(document.querySelectorAll('div[class="modelNo"] > span')).map(elm => elm.innerText.trim().match(/[^#]+$/)[0]).join('-49350-');
          const api = `https://content.syndigo.com/page/9827c4b9-a79e-4fa7-86f8-ac2e4d8a0d66/${id}.json`;
          const response = await fetch(api);
          const json = await response.json();
          if (Object.keys(json).length) {
            return json;
          }
        }
        return false;
      }
      async function getCompareTable() {
        if (Array.from(document.querySelectorAll('div[class="modelNo"] > span')).length) {
          const id = Array.from(document.querySelectorAll('div[class="modelNo"] > span')).map(elm => elm.innerText.trim().match(/[^#]+$/)[0]).join('-49350-');
          const api = `https://scontent.webcollage.net/lowes/power-page?ird=true&channel-product-id=${id}`;
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(api)}`);
          const text = (await response.json()).contents;
          eval(text);
          // add HTM Content
          const div = document.createElement('div');
          div.id = 'added-ec';
          div.innerHTML = window._wccontent.aplus.html;
          document.body.append(div);
          return Boolean(window._wccontent.aplus.html.match(/wc-comparison-table/));
        }
      }
      const json = await getWitbAndComparison();
      console.log(json);
      if (json) {
        let witb = Object.values(Object.values(Object.values(json.experiences).find(elm => elm.hasOwnProperty('experiences')).experiences).find(elm => elm.hasOwnProperty('widgets')).widgets).filter(elm => elm.headerText.match(/in the box/i));
        witb = (witb[0] && witb[0].items[0].features.map(elm => ({ text: elm.caption, img: elm.asset.url.replace('{0}', elm.asset.originalWidth) }))) || [];
        const hasComparision = Object.values(Object.values(Object.values(json.experiences).find(elm => elm.hasOwnProperty('experiences')).experiences).find(elm => elm.hasOwnProperty('widgets')).widgets).filter(elm => elm.widgetType.match(/ComparisonTable/i));
        document.body.setAttribute('has-comparison', Boolean(hasComparision && hasComparision.length));
        document.body.setAttribute('witb-text', witb.map(elm => elm.text).join('|'));
        document.body.setAttribute('witb-url', witb.map(elm => elm.img).join('|'));
      } else {
        document.body.setAttribute('has-comparison', await getCompareTable());
      }
    }
    try {
      await context.evaluate(addWitbandCRT);
    } catch (error) {
      console.log('error adding witb and ctr', error);
    }
    return await context.extract(productDetails, { transform });
  },
};

