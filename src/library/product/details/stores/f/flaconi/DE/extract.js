
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform: cleanUp,
    domain: 'flaconi.de',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {

    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // @ts-ignore
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
        // @ts-ignore
        addElementToDocument('fl_directioninfo', directionelement1.innerText);
      } else if (directionelement2) {
        // @ts-ignore
        addElementToDocument('fl_directioninfo', directionelement2.innerText);
      }
      const variantCount = 0;
      addElementToDocument('variantCount', variantCount);
      const colorlement = document.evaluate("//ul[@id='makeup-color-list']/li[1]//span/@style", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // @ts-ignore
      if (colorlement && colorlement.value.indexOf('background-color') > -1) {
        // @ts-ignore
        const colorCode = colorlement.value.slice(colorlement.value.indexOf('#') + 1);
        addElementToDocument('fl_colorcode', colorCode);
      }
      const videoarr = document.querySelectorAll('div.lazyYoutube > a[title=""]');
      if (videoarr && videoarr.length) {
        addVideoElementToDocument('pd_video', videoarr);
      }
      // Double Pipe Concatenation
      const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        addElementToDocument(id, doubleSeparatorText);
      };
      var descfinal = [];
      //const description1 = getXpath("//div[@class='description-content']//text()", 'nodeValue');
      // @ts-ignore
      var description1 = document.querySelectorAll("div[class='description-content']")[0].innerText;
      if (description1.length > 0) {
        descfinal.push(description1)
      }
      var countLi = document.querySelectorAll("ul[class='product-properties-list'] li");
      for (let i = 0; i < countLi.length; i++) {
        // @ts-ignore
        descfinal.push(countLi[i].innerText);
      }

      //var ratingValue = aggregateRating ? aggregateRating.replace(/^\D+/g, '') : '';
      pipeSeparatorDouble('desc', descfinal);
      const rpc1 = getXpath('//meta[@itemprop="sku"]/@content','nodeValue')
      var rpc=rpc1.split("-")
      addElementToDocument('rpc',rpc[0])
      const rating = getXpath('(//span[@class="sr-only"])[1]//text()','nodeValue')
      var rating1=rating.split(" ")
      addElementToDocument('rating',rating1[0])
      const name1 = getXpath('//div[@class="product-name"]//a//text()','nodeValue')
      const name2 = getXpath('//div[@class="product-name"]//span[@itemprop="name"]//text()','nodeValue')
      addElementToDocument('name',name1+" "+name2)
    });
    await context.extract(productDetails);
  },
};
