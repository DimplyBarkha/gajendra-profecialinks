const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'lowes',
    transform,
    domain: 'lowes.ca',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.click('button[aria-label="Close"]');
    } catch (error) {
      console.log('No Pop up was present');
    }
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(8000);
          break;
        }
      }
      function stall(ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
    await context.evaluate(() => {
      function addEleToDoc(key, value, tag) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        tag ? document.body.prepend(prodEle) : document.body.appendChild(prodEle);
      }
      const iFrame = document.querySelector('iframe[title="Product Videos"]');
      if (iFrame) {
        // @ts-ignore
        var finalSrc = iFrame.contentWindow.document.getElementsByTagName('video');
        for (let index = 0; index < finalSrc.length; index++) {
          if (finalSrc[index].src) {
            addEleToDoc('pd_videos', finalSrc[index].src, false);
          }
        }
      }
      // @ts-ignore
      let response = document.querySelector('script[type="application/ld+json"]') && document.querySelector('script[type="application/ld+json"]').innerText;
      if (response) {
        response = JSON.parse(response);
        if (response.aggregateRating) {
          response.aggregateRating.ratingValue && addEleToDoc('pd_aggregate', response.aggregateRating.ratingValue, true);
        }
      }
    });
    try {
      await context.waitForXPath('//li[@id="manufacturer-content-jump"]');
      await context.waitForXPath('//div[@id="product-manufacturer-content"]');
    } catch (error) {
      console.log('specifications noy loaded.');
    }
    try {
      await context.waitForXPath('//section[@class="product-specifications"]//table//tr');
    } catch (error) {
      console.log('specifications not loaded.');
    }
    // For the Additional Fields
    await context.evaluate(async function () {
      const syndiPowerpage = document.querySelector('.syndi_powerpage');
      let inTheBoxText = '';
      let inTheBoxUrl = '';
      let hasComparisonTable = 'No';
      if (syndiPowerpage) {
        const headings = Array.from(syndiPowerpage.shadowRoot.querySelectorAll('h2'));
        headings.forEach(h2 => {
          if (h2.innerText.includes('In the box') || h2.innerText.includes('In The Box') || h2.innerText.includes('in the box') || h2.innerText.includes("What's Included") || h2.innerText.includes('In the Box')) {
            const parent = h2.parentElement;
            const inTheBoxEls = parent.querySelectorAll('.syndigo-featureset-feature');
            inTheBoxEls.forEach(el => {
              const imgs = el.querySelector('img').getAttribute('srcset').split(',');
              let images = '';
              if (imgs.length === 1) {
                images = imgs[0];
              } else {
                images = imgs[imgs.length - 1];
              }
              images = images.replace(/(.+)(\s.+)/, '$1');
              inTheBoxUrl = inTheBoxUrl + (inTheBoxUrl ? ' || ' : '') + images;
              // @ts-ignore
              inTheBoxText = inTheBoxText + (inTheBoxText ? ' || ' : '') + el.innerText;
            });
          }
        });
        const table = syndiPowerpage.shadowRoot.querySelector('div[class*="comparison-table"] table');
        if (table) {
          hasComparisonTable = 'Yes';
        }
      } else {
        const table = document.querySelector('div[class*="comparison-table"] table');
        if (table) {
          hasComparisonTable = 'Yes';
        }

        const inTheBoxEls1 = Array.from(document.querySelectorAll('[data-section-tag*="in-the-box"] > div> div> ul >li,[data-section-caption*="In the box"] > div> div> ul >li , [data-section-caption*="In The Box"] > div> div> ul >li'));

        const inTheBoxEls2 = Array.from(document.querySelectorAll('div[data-section-caption="In the box"] ul>li , div[data-section-caption="In The Box"] ul>li'));

        let inTheBoxEls = [];
        if (inTheBoxEls1) {
          inTheBoxEls = inTheBoxEls1;
        } else {
          inTheBoxEls = inTheBoxEls2;
        }
        inTheBoxEls.forEach(el => {
          const image = el.querySelector('img').getAttribute('src');
          // @ts-ignore
          const text = el.innerText;
          inTheBoxUrl = inTheBoxUrl + (inTheBoxUrl ? ' || ' : '') + image;
          inTheBoxText = inTheBoxText + (inTheBoxText ? ' || ' : '') + text;
        });
      }
      document.body.setAttribute('has-comparison-table', hasComparisonTable);
      document.body.setAttribute('in-the-box-text', inTheBoxText);
      document.body.setAttribute('in-the-box-url', inTheBoxUrl);
    });
    return await context.extract(productDetails, { transform });
  },
};
