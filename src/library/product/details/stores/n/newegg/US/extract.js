const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'newegg',
    transform,
    domain: 'newegg.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      function timeout (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      await timeout(5000);
      const video = document.querySelector('video.jw-video');
      if (video) {
        var url = '';
        video.click();
        url = video.getAttribute('src');
        if (url) {
          addHiddenDiv('video-url', url);
        }
      }
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    });

    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
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
      });
    };
    await applyScroll(context);
    await new Promise(resolve => setTimeout(resolve, 20000));
    await context.evaluate(async () => {
      let checkElement = document.querySelector("#product-buying + div > div.tab-navs div:nth-child(2)");
      if (checkElement) {
        checkElement.click();
        console.log('cliked');
      } else {
        console.log('Did not found element');
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
