const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.evaluate(async () => {
      try {
        if (document.querySelector('.c24-cookie-consent-button')) {
          // document.querySelector('.c24-cookie-consent-button').click();
          // await new Promise(resolve => setTimeout(resolve, 2000));
          document.querySelector('.c24-cookie-consent-screen a:last-child.c24-cookie-consent-button').click();
        }
        return;
      } catch (error) {
        console.log('No pop up');
      }
    });
  } catch (e) {
    console.log('Error while closing popup');
  }
  // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      let lastScrollValue = 0;
      while (scrollTop !== 12000) {
        await stall(1000);
        lastScrollValue = scrollTop;
        scrollTop += 500;
        window.scroll(lastScrollValue, scrollTop);
        if (scrollTop === 12000) {
          await stall(2000);
          break;
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
  };
  // await new Promise(resolve => setTimeout(resolve, 6000));
  await applyScroll(context);
  // await new Promise(resolve => setTimeout(resolve, 6000));
  await context.evaluate(async function () {
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('.grid-product')[index];
      originalDiv.appendChild(newDiv);
      console.log('child appended ' + index);
    }

    document.querySelectorAll('.grid-product').forEach((element, index) => {
      const starFull = element.querySelectorAll('.grid-product__details .rating-stars .star_full').length;
      const starHalf = element.querySelectorAll('.grid-product__details .rating-stars .star_half').length;
      addHiddenDiv('fullStarCount', starFull, index);
      addHiddenDiv('halfStarCount', starHalf, index);
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'check24',
    transform: transform,
    domain: 'check24.de',
    zipcode: '',
  },
  implementation,
};
