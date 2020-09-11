const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.be',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      if (document.querySelector('gdpr-cookie-layer--show') && document.querySelector('button.gdpr-cookie-layer__btn--submit')) {
        document.querySelector('button.gdpr-cookie-layer__btn--submit').click();
      }
    });
    async function autoScroll () {
      await context.evaluate(async function () {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            if (document && document.body && document.body.scrollHeight) {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                resolve();
              }
            }
          }, 100);
        });
      });
    }

    await new Promise(resolve => setTimeout(resolve, 8000));
    autoScroll();

    // await context.evaluate(async function () {
    //   let scrollTop = 0;
    //   while (scrollTop !== 20000) {
    //     await stall(500);
    //     scrollTop += 1000;
    //     window.scroll(0, scrollTop);
    //     if (scrollTop === 20000) {
    //       await stall(5000);
    //       break;
    //     }
    //   }
    //   function stall (ms) {
    //     return new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         resolve();
    //       }, ms);
    //     });
    //   }
    // });
    await context.evaluate(async function () {
      document.querySelector('footer#page-footer').scrollIntoView();
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    let content = null;
    let image = null;

    async function addHiddenInfo (elementID, content) {
      await context.evaluate(async function (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.id = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }, elementID, content);
    }

    async function addHiddenArrayList (elementID, value) {
      await context.evaluate(async function (elementID, value) {
        const htmlString = `<span style="display:none" id="added_${elementID}" ></span>`;
        const root = document.body;
        root.insertAdjacentHTML('beforeend', htmlString);
        const innerHTML = value.reduce((acc, val) => {
          return `${acc}<li>${val}</li>`;
        }, '<ul>') + '</ul>';
        document.querySelector(`#added_${elementID}`).innerHTML = innerHTML;
      }, elementID, value);
    }

    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    // const hasManuf = await context.evaluate(async function () {
    //   return document.querySelector('div#containerLoadbee');
    // });

    // if (hasManuf) {
    //   await context.waitForSelector('div.loadbeeTabContent', { timeout: 65000 });
    // }

    const apiManufCall = await context.evaluate(async function () {
      return document.querySelector('iframe#loadbeeIframeId') ? document.querySelector('iframe#loadbeeIframeId').getAttribute('src') : null;
    });

    console.log('apiManufCall');
    console.log(apiManufCall);

    if (apiManufCall) {
      await context.goto(apiManufCall);
      // The code snippet below will be executed in the website's scope.
      await context.evaluate(async function () {
        console.log(document.querySelector('h1.next-chapter'));
      });
      const text = await context.evaluate(async function () {
        return document.querySelector('body').innerText;
      });
      content = text;
      const images = await context.evaluate(async function () {
        const images = document.querySelectorAll('body img');
        let imagesSrc = [];
        [...images].forEach((element) => {
          imagesSrc.push(element.getAttribute('src'));
        });
        // imagesSrc = imagesSrc.slice(0, imagesSrc.length - 1);
        return imagesSrc;
        // return imagesSrc.join(' || ');
      });
      image = images;
      await context.goto(link);
      addHiddenInfo('ii_manufContent', 'dsd');
      if (image) {
        addHiddenArrayList('ii_manufImg', image);
        // image.forEach((element, index) => {
        //   addHiddenInfo('ii_manufImg'+index, element);
        // });
      }
    }
    const availText = await context.evaluate(async function () {
      return document.querySelector('meta[itemprop="availability"]') ? document.querySelector('meta[itemprop="availability"]').getAttribute('content') : '';
    });
    ;

    addHiddenInfo('ii_availText', availText);

    return await context.extract(productDetails, { transform });
  },
};
