
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'FR',
    store: 'origines',
    transform: null,
    domain: 'origines.fr',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { variants }) => {
    try {
      await context.waitForSelector('.swatch-opt .swatch-attribute .item-option .item-option-inner .item-option-label', 10000);
    } catch (e) {
      console.log(e, 'no color variant');
    }
    // await context.waitForSelector('.swatch-opt .swatch-attribute .item-option .item-option-inner .item-option-label', 15000);
    await context.evaluate(async function () {
      // if (document.querySelector('[aria-labelledby="tab-label-product.info.form.options.tab"]:not(.hidden)') !== null) {
      //   console.log('variants', this);
      //   // await
      //   context.waitForSelector('.swatch-opt .swatch-attribute .item-option .item-option-inner .item-option-label');
      // }
      // function stall (ms) {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       resolve();
      //     }, ms);
      //   });
      // }
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
      // window.setTimeout(function () {
      const variantObjectInfo = getAllXpath("//div[contains(@class,'swatch-opt')]//div[contains(@class,'swatch-attribute')]//div[contains(@class,'item-option')]//div[contains(@class,'item-option-inner')]//div[contains(@class,'item-option-label')]/text()", 'nodeValue');
      console.log('variantObjectInfo', variantObjectInfo);
      if (variantObjectInfo != null && variantObjectInfo.length) {
        // const variantObject = JSON.parse(variantObjectInfo);
        // console.log(variantObject);
        // const variantsDetails = (variantObject[0].options.ga.label).split('|');
        // // eslint-disable-next-line no-shadow
        // const variants = variantsDetails[1].split(',');
        const targetElement = document.querySelector('body');
        const newUl = document.createElement('ul');
        newUl.id = 'variantsadd';
        targetElement.appendChild(newUl);

        const ul = document.querySelector('#variantsadd');

        try {
          console.log('variantObjectInfo', variantObjectInfo);
          if (variantObjectInfo.length) {
            for (let i = 0; i < variantObjectInfo.length; i++) {
              const listItem = document.createElement('li');
              setAttributes(listItem, {
                variant_url: window.location.href + '?color=' + variantObjectInfo[i],
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
    }, 10000);
    // let scrollTop = 500;
    // while (true) {
    //   window.scroll(0, scrollTop);
    //   await stall(1000);
    //   scrollTop += 500;
    //   if (scrollTop === 10000) {
    //     break;
    //   }
    // };
    // });
    await context.extract(variants);
  },
};
