
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform: null,
    domain: 'flaconi.de',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
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
      function addVideoElementToDocument (key, arr) {
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
        const variantCount=0;
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
      const description1 = getXpath("//div[@class='description-content']//text()", 'nodeValue');
      //var ratingValue = aggregateRating ? aggregateRating.replace(/^\D+/g, '') : '';
      //addElementToDocument('addedAggregateRating', (ratingValue ? (parseInt(ratingValue) / 20) : ''));
      const description2 = getXpath("(//ul[@class='product-properties-list']//li)[1]//text()", 'nodeValue');
      const description3 = getXpath("(//ul[@class='product-properties-list']//li)[2]//text()", 'nodeValue');
      const description4 = getXpath("(//ul[@class='product-properties-list']//li)[3]//text()", 'nodeValue');
      const description5 = getXpath("(//ul[@class='product-properties-list']//li)[4]//text()", 'nodeValue');
     //var ratingValue = aggregateRating ? aggregateRating.replace(/^\D+/g, '') : '';
      addElementToDocument('desc', description1+description2+description3+description4+description5);
    });
    await context.extract(productDetails);
  },
};
