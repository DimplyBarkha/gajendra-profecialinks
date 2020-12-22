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
    await context.waitForXPath(`//article[contains(@class, 'a_plus_content')]//img/@src | //div[contains(@class,'wc-reset')]//li//img/@src | //article[contains(@class, 'a-plus-content')]//img/@src | //div[@id="product-overview"]//div[@class="flix-container"]//img/@src | (//div[@id="product-overview"]//a//img[@alt="Product image"]/@src)[1] | (//div[@id="product-overview"]//a//img/@src)[1]`);
    await context.evaluate(async () => {
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
    

    // async function smoothToBottom(context) {
    //     // change the time to make the ani go faster or slower
    //     await context.evaluate(async function() {
    //       var scrollTimer = setInterval(function () {
    //         window.scrollBy(0, 10);
    //       }, 200);
    //       if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //           // you're at the bottom of the page
    //           clearInterval(scrollTimer);
    //       }
    //     });
    // }
  
    // await smoothToBottom(context);
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
