
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform: cleanUp,
    domain: 'flaconi.de',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {

    try {
      const cssBanner = "button#uc-btn-accept-banner";
      const isSelectorAvailable = async (cssSelector) => {
        console.log(`Is selector available: ${cssSelector}`);
        return await context.evaluate(function (selector) {
          return !!document.querySelector(selector);
        }, cssSelector);
      };

      console.log('.....waiting......');
      await context.waitForSelector(cssBanner, { timeout: 10000 });

      const bannerAvailable = await isSelectorAvailable(cssBanner);
      if (bannerAvailable) {
        await context.click(cssBanner);

      }
    }
    catch (error) { console.log("No overlay") }
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      function addVideoElementToDocument(key, arr) {
        const catElement = document.createElement('div');
        catElement.id = key;
        for (let i = 0; i < arr.length; i++) {
          const videoElement = document.createElement('a');
          videoElement.href = arr[i].href;
          catElement.appendChild(videoElement);
        }
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const directionelement1 = document.evaluate("//div[contains(@class, 'instruction-content')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const directionelement2 = document.evaluate("//div[contains(@class, 'instruction')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (directionelement1) {
        addElementToDocument('fl_directioninfo', directionelement1.innerText);
      } else if (directionelement2) {
        addElementToDocument('fl_directioninfo', directionelement2.innerText);
      }
      const variantCount = 0;
      addElementToDocument('variantCount', variantCount);
      const colorlement = document.evaluate("//ul[@id='makeup-color-list']/li[1]//span/@style", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (colorlement && colorlement.value.indexOf('background-color') > -1) {
        const colorCode = colorlement.value.slice(colorlement.value.indexOf('#') + 1);
        addElementToDocument('fl_colorcode', colorCode);
      }
      const videoarr = document.querySelectorAll('div.lazyYoutube > a[title=""]');
      if (videoarr && videoarr.length) {
        addVideoElementToDocument('pd_video', videoarr);
      }
      let description = getXpath("//div[@class='description-content']//text()", 'nodeValue');
      //var ratingValue = aggregateRating ? aggregateRating.replace(/^\D+/g, '') : '';
      //addElementToDocument('addedAggregateRating', (ratingValue ? (parseInt(ratingValue) / 20) : ''));
      let nodes = document.querySelectorAll("ul.product-properties-list li");
      if (nodes.length > 0) {
        description = description + ' || ';
      }
      nodes.forEach(node => {
        description += `${node.innerText} || `;
      });
      if (nodes.length > 0) {
        description = description.slice(0, -4);
      }

      //var ratingValue = aggregateRating ? aggregateRating.replace(/^\D+/g, '') : '';
      addElementToDocument('desc', description);
    });
    await context.extract(productDetails);
  },
};
