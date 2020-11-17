const { transform } = require('../../../../../search/shared');


async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    let scrollTop = 0;
    // document.querySelector('button[data-role="close-and-accept-consent"]').click();
    // while (scrollTop !== 20000) {
    //   await stall(2000);
    //   scrollTop += 3000;
    //   window.scroll(0, scrollTop);
    //   if (scrollTop === 15000) {
    //     await stall(1000);
    //     break;
    //   }
    // }
    function getElements() {
      return document.querySelectorAll("section article[data-item='true']");
    }
    const elements = getElements();
    if (elements.length) {
      for (var i=0; i < elements.length; i++) {
        elements[i].scrollIntoView();
        await stall(1500);
        let imageUrl = getElements()[i].querySelector("a[rel='nofollow'] img, ul li:nth-child(1) img");
        console.log(imageUrl);
        elements[i].setAttribute('image-url', imageUrl.getAttribute('src'));
        console.log(elements[i]);
      }
    }

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    transform,
    domain: 'allegro.pl',
    zipcode: '',
  },
  implementation
};
