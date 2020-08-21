const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  // await context.waitForSelector('.widget-Popup--container-outer---view-popup', { timeout: 20000 }); 
  // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  await context.evaluate(async function () {
    if (document.querySelector('.widget-Popup--container-outer---view-popup')) {
      document.querySelector('.widget-Popup--container-outer---view-popup').click();
    }
    if (document.querySelector('i.widget-Popup--close')) {
      document.querySelector('i.widget-Popup--close').click();
    }

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    addHiddenDiv('searchurl', window.location.href);

    // function addElementToDocument (doc, key, value) {
    //   const catElement = document.createElement('div');
    //   catElement.id = key;
    //   catElement.textContent = value;
    //   catElement.style.display = 'none';
    //   doc.appendChild(catElement);
    // }
    // const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
    // const arr = document.querySelectorAll('div.category-products > ul > li:not([class="no-hover"])');
    // for (let i = 0; i < arr.length; i++) {
    //   addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
    // }
    // localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
  });
  // await context.waitForSelector('div.referenced.list div[class^="widget-ArticleList--article"] div[class~="widget-Container--subContent"] div.widget-Root--subContent');
  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    transform: transform,
    domain: 'expert.de',
    zipcode: '',
  },
  implementation,
};
