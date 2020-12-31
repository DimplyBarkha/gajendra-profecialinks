const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    if (document.querySelector('span.price-old span[id*="sec_list_price"]')) {
      const newPrice = document.querySelector('span.price span[id*="sec_discounted_price"]').innerText;
      const oldPrice = document.querySelector('span.price-old span[id*="sec_list_price"]').innerText;
      const promotion = 'Save € ' + (oldPrice - newPrice) + ' today';
      addHiddenDiv('promotionText', promotion);
    }
    let description = document.querySelector('div#content_description > div.product-tab-wrapper');

    description = description ? description.children : [];
    let finalDescription = '';
    let flag = false;
    for (const element of description) {
      if (element.id === 'flix-inpage') {
        break;
      };
      if (!element.innerText) {
        continue;
      }
      if (element.nodeName === 'UL') {
        flag = true;
        for (const li of element.children) {
          finalDescription += ` || ${li.innerText}`;
        }
      } else if (element.nodeName === 'LI') {
        flag = true;
        finalDescription += ` || ${element.innerText}`;
      } else {
        if (flag) {
          flag = false;
          finalDescription += ` | ${element.innerText}`;
        } else {
          flag = false;
          finalDescription += ` ${element.innerText}`;
        }
      }
    }
    addHiddenDiv('ii_description', finalDescription);
    if (document.querySelector('button#onetrust-accept-btn-handler')) {
      document.querySelector('button#onetrust-accept-btn-handler').click();
    }
  });
  const delay = t => new Promise(resolve => setTimeout(resolve, t));
  await delay(10000);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'harveynorman',
    transform,
    domain: 'harveynorman.ie',
    zipcode: '',
  },
  implementation,
};
