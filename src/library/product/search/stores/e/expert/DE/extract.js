async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  // await context.waitForSelector('.widget-Popup--container-outer---view-popup', { timeout: 20000 }); 
  await context.evaluate(async function () {
    if (document.querySelector('.widget-Popup--container-outer---view-popup')) {
      document.querySelector('.widget-Popup--container-outer---view-popup').click();
    }
    if (document.querySelector('i.widget-Popup--close')) {
      document.querySelector('i.widget-Popup--close').click();
    }
    console.log('hello!')
    // function addHiddenDiv (i, productCards, productInfo) {
    //   const newDiv = document.createElement('div');
    //   newDiv.id = i;
    //   newDiv.className = 'extra-info';
    //   newDiv.style.display = 'none';
    // }

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
  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    transform: null,
    domain: 'expert.de',
    zipcode: '',
  },
  implementation,
};
