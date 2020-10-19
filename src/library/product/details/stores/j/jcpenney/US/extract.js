const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    // function addHiddenDiv (id, content) {
    //   const newDiv = document.createElement('div');
    //   newDiv.id = id;
    //   newDiv.textContent = content;
    //   newDiv.style.display = 'none';
    //   document.body.appendChild(newDiv);
    // }

    // const optionalWait = async (sel) => {
    //   try {
    //     await context.waitForSelector(sel, { timeout: 60000 });
    //   } catch (err) {
    //     console.log(`Couldn't load selector => ${sel}`);
    //   }
    // };

    const isVariants = document.querySelector('ul[data-automation-id="product-dimensions-color"]');
    if (isVariants) {
      document.querySelectorAll('ul[data-automation-id="product-dimensions-color"] li div button').forEach(ele => {
      ele.click();
      console.log('Clicked');
      // optionalWait('h1[data-automation-id="product-title"]');
      const mainImage = document.querySelector('div._3IMdO div.image-desktop img').getAttribute('src');
      const newDiv = document.createElement('div');
      newDiv.id = 'mainImage';
      newDiv.textContent = mainImage;
      // newDiv.style.display = 'none';
      document.querySelector('main#mainContainerBlock').appendChild(newDiv);
      });
    }

    let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(1000);
      scrollTop += 500;
      if (scrollTop === 10000) {
        break;
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'jcpenney',
    transform,
    domain: 'jcpenney.com',
    zipcode: '',
  },
  implementation,
};
