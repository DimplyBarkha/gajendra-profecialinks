const { cleanup } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'jccampbellelectrics',
    transform: cleanup,
    domain: 'jccampbellelectrics.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      let rating = getXpath("//div[@class='rating']/@style", 'nodeValue');
      console.log('rating fetched ' + rating);

      // const regexp = /\:(\w+)\%/;
      if (rating != null && rating.includes('width')) {
        rating = rating.split(':');
        rating = rating[1];
        console.log('rating fetched ' + rating);
        if (rating.includes('%')) {
          // rating = rating.match(regexp);
          rating = rating.split('%');
          rating = rating[0];
          console.log('rating fetched ' + rating);
          rating = rating * 0.05;
          console.log('rating fetched ** ' + rating);
          addElementToDocument('added_rating', rating);
        }
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }

      let video = getXpath("//div[@class='fullJwPlayerWarp']//div//input/@value", 'nodeValue');
      if (video != null) {
        video = JSON.parse(video);
        video = video.playlist[0].file;
        console.log('video fetched ' + video);
        addElementToDocument('added_video', video);
      }

      const manufacturerImages = getAllXpath("//div[@class='flix-background-image inpage_wowimg' or @class='flix-background-image']/img/@srcset", 'nodeValue').join(' | ');
      // console.log('manufacturerImages   ' + manufacturerImages);
      addElementToDocument('added_manufacturerImages', manufacturerImages);
      const manufacturerDescription = getAllXpath("//div[@class='flix-std-title flix-Header flix-d-h3' or @class='flix-std-desc flix-Body flix-d-p']/text()  |  //div[@class='flix-std-content']//div[contains(@class,'flix-std-title flix-d-h3')]//text() | //div[@class='flix-std-content']//div[contains(@class,'flix-std-desc flix-d-p')]//text()", 'nodeValue').join(' ');
      // console.log('manufacturerDescription   ' + manufacturerDescription);
      addElementToDocument('added_manufacturerDescription', manufacturerDescription);

      const productOtherInformation = getAllXpath("//tbody//tr//th[@class='label']/text() | //tbody//tr//td[@class='data last']/text()", 'nodeValue').join('|');
      // console.log('productOtherInformation  ' + productOtherInformation);
      addElementToDocument('added_productOtherInformation', productOtherInformation);
      const specifications = getAllXpath("//div[@class='flix-value flix-d-h3' or @class='flix-title flix-d-p']//span/text() | //p[@class='eky-specs-label-top']/text() | //p[@class='eky-specs-label-bottom']/span/text()", 'nodeValue');
      // console.log('specifications   ' + specifications);
      addElementToDocument('added_specifications', specifications);

      const additionalDescBulletInfo = getAllXpath("//p[contains(@class,'MsoListParagraph')]//font/text()", 'nodeValue').join(' | ');
      // console.log('additionalDescBulletInfo   ' + additionalDescBulletInfo);
      addElementToDocument('added_additionalDescBulletInfo', additionalDescBulletInfo);

      const description = getAllXpath("(//p[contains(@class,'MsoNormal')]//font/text() | //p[contains(@class,'MsoListParagraph')]//font/text())", 'nodeValue').join(' | ');
      // console.log('description   ' + description);
      addElementToDocument('added_description', description);

      addElementToDocument('added_variantCount', 0);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
