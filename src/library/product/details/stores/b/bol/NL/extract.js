const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    let videoSelector = null;
    await context.evaluate(async function () {
      let videoEle = document.querySelector("a[data-test='product-video']")
      if (videoEle) {
        videoEle.click();
        console.log('video clicked')
        videoSelector = "video[data-test='wsp-video-element']";
      }
    });

    try {
      await context.evaluate(async function () {
        const descEl = document.querySelector('.product-description');
        let bulletCount = 0;

        if (descEl) {
          const listItem = descEl.querySelectorAll('li');
          bulletCount = listItem.length;

          for (const item of listItem) {
            item.innerText = `||${item.innerText.trim()}`;
          }

          let descString = descEl.innerText ? descEl.innerText.trim() : '';
          descString = descString.split('\n');

          for (const str of descString) {
            if (str.trim().startsWith('-') || str.trim().startsWith('•')) {
              bulletCount++;
            }
          }
        }

        document.body.setAttribute('import-bullet-count', bulletCount);

        const directionsEl = document.evaluate(`//div[@class='specs'][contains(., 'Gebruikswijze')]/dl`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (directionsEl) {
          let contentString = '';
          for (let i = 0; i < directionsEl.children.length; i += 2) {
            if (i == 0) {
              contentString = `${contentString}${directionsEl.children[i].innerText} ${directionsEl.children[i + 1].innerText}`;
            } else {
              contentString = `${contentString} | ${directionsEl.children[i].innerText} ${directionsEl.children[i + 1].innerText}`;
            }
          }

          const newDirEl = document.createElement('import-direction');
          newDirEl.innerText = contentString;
          document.body.appendChild(newDirEl);
        }
      })
    } catch (err) {
      console.log(err.message)
    }
    
    return await context.extract(productDetails, { transform: transformParam });
  },
};
