const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform: cleanUp,
    domain: 'ahlens.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const sliceURL = (data) => {
        for (let index = 0; index < data.length; index++) {
          if (data[index].includes(":-")) {
            var temp = data[index].replace(":-", "");
          } else {
            temp = data[index].replace(":", ".");
          }
          addElementToDocument('altImage1', temp+"SEK");
        }
      };
      var backgroundURL = getAllXpath("(//b[@class='ah-price'])[1]/text()", 'nodeValue');
      sliceURL(backgroundURL);
      const sliceURL1 = (data) => {
        for (let index = 0; index < data.length; index++) {
          if (data[index].includes(":-")) {
            var temp = data[index].replace(":-", "");
          } else {
            temp = data[index].replace(":", ".");
          }
          addElementToDocument('altImage2', temp+"SEK");
        }
      };
      var backgroundURL1 = getAllXpath("//div[@class='ah-pdp-product-price pt-- mb--']/div[@class='ah-product-price nobreak-ellipsis']/div[1]/span[@class='ah-offer ah-offer--old-price']/text()", 'nodeValue');
      sliceURL1(backgroundURL1);
    //   const sliceURL2 = (data) => {
    //     var singleSeparatorText = data[0].split(',');
    //     for (let i = 0; i < singleSeparatorText.length; i++) {
    //       var output = singleSeparatorText[i].split(" ");
    //       addElementToDocument('altImage', 'https://www.ahlens.se/' + output[0]);
    //     }
    //   };
    //   var backgroundURL2 = getAllXpath("//div[@class='slick-list draggable']/div[@class='slick-track']/li[@class='ah-image-carousel-nav__item slick-slide']/img[@class='ah-product-image']/@src", 'nodeValue');
    //   sliceURL2(backgroundURL2);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
