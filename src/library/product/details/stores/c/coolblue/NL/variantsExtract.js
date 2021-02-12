
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    transform: null,
    domain: 'coolblue.nl',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { variants }) => {
    await context.evaluate(async function () {
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      function setAttributes (el, attrs) {
        for (var key in attrs) {
          el.setAttribute(key, attrs[key]);
        }
      }
      const variantObjectInfo = getXpath("//div[@class='product-order']//div[contains(@data-component,'\"name\":\"trackEventImmediate\"')]/@data-component | //div[@class='product-order']//span[contains(@data-component,'\"name\":\"trackEventImmediate\"')]/@data-component", 'nodeValue');

      if (variantObjectInfo != null) {
        const variantObject = JSON.parse(variantObjectInfo);
        console.log(variantObject);
        const variantsDetails = (variantObject[0].options.ga.label).split('|');
        // eslint-disable-next-line no-shadow
        const variants = variantsDetails[1].split(',');
        const targetElement = document.querySelector('body');
        const newUl = document.createElement('ul');
        newUl.id = 'variantsadd';
        targetElement.appendChild(newUl);

        const ul = document.querySelector('#variantsadd');

        try {
          if (variants.length) {
            for (let i = 0; i < variants.length; i++) {
              const listItem = document.createElement('li');
              setAttributes(listItem, {
                variant_id: variants[i],
              });
              ul.appendChild(listItem);
            }
          }
        } catch (err) {
          console.log(err, 'api');
          // eslint-disable-next-line no-throw-literal
          throw 'Variant not Available';
        }
      }
    });
    await context.extract(variants);
  },
};
