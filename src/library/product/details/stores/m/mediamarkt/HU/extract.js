const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise(resolve => setTimeout(resolve, 6000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
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

  await context.evaluate(async function () {
    
    let featButton = document.querySelector('div.features-wrapper a');
    if (featButton) {
      // @ts-ignore
      featButton.click();
    }
    let flixButton = document.querySelector('button.flix_expand');
    if (flixButton) {
      // @ts-ignore
      flixButton.click();
    }
    let featValues = document.querySelectorAll('#features dd + dd');
    if (featValues) {
      featValues.forEach(element => {
        element.remove();
      });
    }
    let videoButton = document.querySelector('#flix_product_video');
    if (videoButton) {
      // @ts-ignore
      videoButton.dispatchEvent(new Event('click'));
    }
  });
  await new Promise(resolve => setTimeout(resolve, 6000));
  await applyScroll(context);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'HU',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.hu',
    zipcode: "''",
  },
  implementation
};
