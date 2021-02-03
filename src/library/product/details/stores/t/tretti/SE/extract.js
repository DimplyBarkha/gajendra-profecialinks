const { cleanUp } = require('../../../../shared');

async function implementation (
// @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // await context.evaluate(async function () {
  await new Promise(resolve => setTimeout(resolve, 5000));
  await context.waitForSelector('#vipGalleryOnPage > div.gallery__details__outer > div.gallery__details.js-gallery-details > div > div:nth-child(1) > div > img');
  await context.evaluate(() => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('id', id);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    // });
    var d = document.querySelectorAll('#specificationSection > div > div > div.vip__specifications__table > div > div.vip__specifications__line');
    var a = '';
    for (let i = 0; i < d.length; i++) {
      if (i != d.length - 1) { a += d[i].innerText + '|'; } else { a += d[i].innerText; }
    }
    a = a.replace(/\n/g, ':');
    a = a.replace(/\|/g, ' || ');
    // console.log(a)

    addHiddenDiv('specification', a);
  });

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'tretti',
    transform: cleanUp,
    domain: 'tretti.se',
    zipcode: '',
  },
  implementation,
  // :  async ({ inputString }, { country, domain }, parameters, context, { productDetails }) => {
  //   const { transform } = parameters;
  //   await context.waitForSelector('#vipGalleryOnPage > div.gallery__details__outer > div.gallery__details.js-gallery-details > div > div:nth-child(1) > div > img');
  //     return await context.extract(productDetails, { transform });
  //   },
};
