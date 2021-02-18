const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('id', id);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    function getElementByXpath (path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    if (document.querySelector('main > div > div > div > div > section > div > div > div > div > div > div > div > div')) {
      var d = document.querySelector('main > div > div > div > div > section > div > div > div > div > div > div > div > div').childNodes;

      var descrip = '';
      d.forEach(e => {
        if (e.nodeName == 'OL' || e.nodeName == 'UL') {
          e.childNodes.forEach(li => {
            descrip += ' ' + li.textContent;
          });
        }
        descrip += e.textContent;
      });

      addHiddenDiv('productOtherInformation', descrip);

      // const ingredients=getElementByXpath("//strong[contains(text(),'Состав')]/parent::*[1] | //section/div//p[contains(text(),'Состав')] ")
      const ingredient1 = getElementByXpath("//strong[contains(text(),'Состав')]/parent::*[1]");
      if (ingredient1) {
        if (ingredient1.textContent.length >= 10) {
          addHiddenDiv('ingredientList', ingredient1.textContent);
        } else {
          const ingredient2 = getElementByXpath("//strong[contains(text(),'Состав')]/parent::*[1]/following-sibling::*[1]");
          if (ingredient2) {
            const ingredientList = ingredient1.textContent + ' ' + ingredient2.textContent;
            addHiddenDiv('ingredientList', ingredientList);
          }
        }
      }
    }

    if (document.querySelector('#app-container > div > div > script')) {
      var data = JSON.parse(document.querySelector('#app-container > div > div > script').innerText);
      if (document.querySelector('#app-container > div > div > script')) {
        if (data.sku !== 0) {
          addHiddenDiv('sku', data.sku);
        }
        if (data.mpn !== 0) {
          addHiddenDiv('mpn', data.mpn);
        }
        if (data.offers.price !== 0) {
          addHiddenDiv('price', data.offers.price);
        }
      }
    }

    var url = window.location.href;
    if (url) {
      addHiddenDiv('prodUrl', url);
    }
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'detsky',
    transform: cleanUp,
    domain: 'detmir.ru',
    zipcode: '',
  },
  implementation,
};
