const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const trial1 = await context.evaluate(() => {
    return document.querySelector('#is_script') ? document.querySelector('#is_script').innerHtml : '';
  });
  const trial2 = await context.evaluate(() => {
    return { ...window._INITIAL_STATE_ };
  });
  console.log(trial1);
  console.log(trial2);

  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 15000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 15000) {
        await stall(3000);
        break;
      }
    }
    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  await context.evaluate(async function () {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }
    const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
    const productSelectors = document.querySelectorAll('div._3O0U0u>div');
    for (let i = 0; i < productSelectors.length; i++) {
      addElementToDocument(productSelectors[i], 'rankOrganic', `${lastProductPosition + i}`);
      const imgUrl = document.querySelectorAll('div._3BTv9X img')[i] ? document.querySelectorAll('div._3BTv9X img')[i].getAttribute('src') : '';
      addElementToDocument(productSelectors[i], 'image', imgUrl);
      const urlData = document.querySelectorAll('a._31qSD5')[i] ? document.querySelectorAll('a._31qSD5')[i].href : document.querySelectorAll('a.Zhf2z-')[i].href;
      document.querySelectorAll('div._3O0U0u>div')[i].setAttribute('producturl', `${urlData}`);
    }
    localStorage.setItem('prodCount', `${lastProductPosition + productSelectors.length}`);
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    transform,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation,
};
