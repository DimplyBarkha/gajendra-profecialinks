
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'bueroshop24',
    transform: null,
    domain: 'bueroshop24.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { variants }) => {
    var searchPage;
    async function currentPageCheck () {
      return await context.evaluate(function () {
        searchPage = document.querySelector('div.plist div.plist_element') !== null;
        return searchPage;
      });
    };
    const productUrl = await context.evaluate(async function () {
      const getUrlXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const url = getUrlXpath("//div[@class='plist']//div[contains(@class,'plist_element')]//div[@class='plist_content']//div[@class='article-content']//div[@class='plist_details']//a[@itemprop='name']/@href", 'nodeValue');
      return url;
    });
    console.log(productUrl);
    const page = await currentPageCheck();
    if (page) {
      await context.goto(productUrl);
    }
    const doesPopupExist = await context.evaluate(function () {
      return Boolean(document.querySelector('button[id="uc-btn-accept-banner"]'));
    });

    if (doesPopupExist) {
      await context.click('button[id="uc-btn-accept-banner"]');
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
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
      function setAttributes (el, attrs) {
        for (var key in attrs) {
          el.setAttribute(key, attrs[key]);
        }
      }
      const variantObject = getAllXpath('//*[@data-family-attribute]//a[@data-id]/@data-id', 'nodeValue');
      // addElementToDocument('variantId', variantObject);
      const targetElement = document.querySelector('body');
      const newUl = document.createElement('ul');
      newUl.id = 'variantsadd';
      targetElement.appendChild(newUl);

      const ul = document.querySelector('#variantsadd');
      try {
        if (variantObject.length) {
          for (let i = 0; i < variantObject.length; i++) {
            const listItem = document.createElement('li');
            setAttributes(listItem, {
              variant_id: variantObject[i].replace(/[^\d]/g, ''),
            });
            ul.appendChild(listItem);
          }
        }
      } catch (err) {
        console.log(err, 'api');
        // eslint-disable-next-line no-throw-literal
        throw 'Variant not Available';
      }
    });
    await context.extract(variants);
  },
};
