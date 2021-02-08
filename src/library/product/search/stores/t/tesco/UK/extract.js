const { transform } = require('../../../../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(500);
      scrollTop += 100;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(5000);
        break;
      }
    }
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 20000 });
        // await new Promise((resolve, reject) => setTimeout(resolve, 4000));
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    optionalWait('li.product-list--list-item:nth-last-child(1) a img[src*="https"]');

  });
  await context.evaluate(async function () {
    let thumbanial = document.querySelectorAll('a[class*="product-image-wrapper"] img')
     const imageArray = [];
    const imageArray1 = [];
    thumbanial.forEach((element) => {
      imageArray.push(element.getAttribute('src'))
      imageArray1.push(element.getAttribute('srcset'))
    })
    const imageUrl = [];

    for (let i = 0; i < imageArray1.length; i++) {
      if (imageArray1[i] != null) {
        imageUrl.push(imageArray1[i].split(',')[0].split(' ')[0]);
      } else {
        imageUrl.push(imageArray[i]);
      }
    }
    const appendDiv = document.querySelectorAll('div[data-auto-id');

    for (let i = 0; i < appendDiv.length; i++) {
      let imageAllUrl = '';
      if (imageUrl != null) {
        imageAllUrl = imageUrl[i];
      }
      appendDiv[i].setAttribute('imagedetail', imageAllUrl);
    }
  })
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    transform,
    domain: 'tesco.com',
  },
  implementation,
};


