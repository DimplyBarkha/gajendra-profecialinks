const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    transform: cleanUp,
    domain: 'medpex.de',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
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
      try {
        const brand = getXpath('//span[@itemprop="brand"]/text()', 'nodeValue');
        addElementToDocument('brand1', brand);
        if (brand == null) {
          const brand = getXpath('//span[@class="productDetails-name"]//text()', 'nodeValue');
          var brand1 = brand.split(" ");
          addElementToDocument('brand1', brand1[0])
        }
      }
      catch (e) {

      }
      try {
        const directions = document.querySelectorAll('div.content.content--productDescription p');
        let siblingsDirections = '';
        for (let index = 0; index < directions.length; index++) {
          let element = directions[index];
          // @ts-ignore
          if (element.innerText === 'Anwendung:') {
            element = element.nextElementSibling;
            while (element) {
              if (element) {
                // @ts-ignore
                siblingsDirections += element.innerText;
                element = element.nextElementSibling;
              } else {
                break;
              }
            }
          }
        }
        addElementToDocument('directions', siblingsDirections)
      } catch (error) {

      }
      try {
        let additionalDescBulletInfo = '';
        const desription = document.querySelectorAll('div[class="content content--productDescription"]')[0].children;
        let siblingsDescription = '';
        let element = desription[0];
        while (element) {
          if (element) {
            if (element.nodeName == 'UL') {
              let ULData = element.children;
              for (let i = 0; i < ULData.length; i++) {
                // @ts-ignore
                siblingsDescription += '||' + ULData[i].innerText;
                // @ts-ignore
                additionalDescBulletInfo += '||' + ULData[i].innerText;
              }
              addElementToDocument('additionalDescBulletInfo', additionalDescBulletInfo)
              element = element.nextElementSibling;
            }
            else {
              // @ts-ignore
              siblingsDescription += ' ' + element.innerText;
              element = element.nextElementSibling;
            }
          } else {
            break;
          }
        }
        addElementToDocument('description', siblingsDescription)
      } catch (error) {

      }
      try {
        const pdf = document.querySelectorAll('a[class="sp2p sp-pdf"]');
        if (pdf.length > 0) {
          addElementToDocument('pdf', 'Yes')
        }
        else {
          addElementToDocument('pdf', 'No')
        }
      } catch (error) {
        addElementToDocument('pdf', 'No')
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
