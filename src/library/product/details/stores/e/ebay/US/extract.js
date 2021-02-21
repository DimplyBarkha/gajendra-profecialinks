// const { implementation } = require('../shared');
const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const notListedItem = await context.evaluate(() => {
    return document.querySelector('div[class*="nodestar-item"]');
  });
  if (notListedItem) {
    await context.click('.nodestar-item-card-details__view>a[href*="www.ebay"]');
  }

  try {
    await context.waitForSelector('iframe#desc_ifr');
  } catch (err) {
    console.log('manufacturer contents not loaded or unavailable');
  }
  const src = await context.evaluate(async function () {
    const iframe = document.querySelector('iframe#desc_ifr');
    // @ts-ignore
    const src = iframe ? iframe.src : '';
    return src;
  });

  async function scrollToRec (node) {
    await context.evaluate(async (node) => {
      var element = document.querySelector(node);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
      }
    }, node);
  }
  await scrollToRec('#rpdCntId, .prodDetailDesc');
  try {
    await context.waitForSelector('#glbfooter');
  } catch (error) {
    console.log('No glbfooter');
  }
  await scrollToRec('#glbfooter, footer');
  try {
    await context.waitForSelector('#FootPanel');
  } catch (error) {
    console.log('No glbfooter');
  }
  try {
    await context.waitForSelector('div.mfe-reco', { timeout: 45000 });
  } catch (error) {
    console.log('No recommendation products');
  }

  async function checkUPDP () {
    await context.evaluate(async () => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      try {
        var updp = document.querySelectorAll('div.mfe-recos-container div.mfe-title.container-truncate span, li.rtxt~li, span.title-text>span, h3.offer-title span');
        if (updp) {
          updp.forEach(item => {
            addElementToDocument('updp_item', item.innerText);
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      } catch (e) {
        console.log('unInterruptedPDP not found');
      }

      console.log('we are on page ', document.URL);
      // div[contains(@class,"si-cnt")]//div[contains(@class,"mbg")]/a | //div[contains(@class,"si-content")]//div[contains(@class,"mbg")]//span[contains(@class,"mbg")]
      let shippingInfoPresent = true; let shippingInfo = '';
      if (document.querySelector('div[class*="seller-details"]')) { shippingInfoPresent = true; }
      if (shippingInfoPresent === true) {
        if (document.querySelector('div[class*="seller-details"] span:nth-child(2)  a:first-child')) { shippingInfo = document.querySelector('div[class*="seller-details"] span:nth-child(2)  a:first-child').innerText; }
        addElementToDocument('shippingInfo', shippingInfo);
      }
      console.log('shippininfo is ', shippingInfo);
    });
  }
  await checkUPDP();

  await context.extract(productDetails, { transform });
  if (src) {
    try {
      await context.setBypassCSP(true);
      await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      await context.waitForSelector('div#ds_div');

      await context.evaluate(async function () {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const aplusImage = document.evaluate('//div[@id="features"]//span[@class="image"]/img/@src', document).iterateNext().textContent;
        console.log(aplusImage);
        const manufacturercDesc = document.querySelector('div#ds_div .container.threes').innerText.trim();
        if (aplusImage) {
          addHiddenDiv('manufacturercDesc', manufacturercDesc);
        }
      });
      try {
        await context.waitForSelector('div#inthebox');
      } catch (error) {
        console.log('No inthebox');
      }
      await scrollToRec('div#inthebox');
      await scrollToRec('div.inthebox');
      await scrollToRec('div#footer-wrapper');
      return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
    } catch (error) {
      try {
        await context.setBypassCSP(true);
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('div#ds_div');
        await context.evaluate(async () => {
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
          let specsText = '';
          if (document.querySelectorAll('div[class*="p-wrapper"] div[class*="p-spec"]').length !== 0) {
            const specDivs = document.querySelectorAll('div[class*="p-wrapper"] div[class*="p-spec"]');
            for (let i = 0; i < specDivs.length; i++) {
              if (specDivs[i].querySelector('span[class*="p-val"]') && specDivs[i].querySelector('span[class*="p-val"]').innerText !== '') { specsText += specDivs[i].querySelector('span[class*="p-title"]').innerText + ' || ' + specDivs[i].querySelector('span[class*="p-text"]').innerText + ' || '; }
              if (specDivs[i].querySelector('b') && specDivs[i].querySelector('b').innerText !== '') { specsText += specDivs[i].querySelector('p').innerText + ' || '; }
            }
          } else if (document.querySelectorAll('table td div[id*="ds_div"] p')) {
            const specsParas = document.querySelectorAll('table td div[id*="ds_div"] p');
            for (let i = 0; i < specsParas.length; i++) {
              if (!specsParas[i].innerText.includes('Specifications')) { specsText += specsParas[i].innerText + ' || '; }
            }
          }
          if (document.querySelectorAll('div[class*="container"] div[class="spec"]').length !== 0) {
            const specDivs = document.querySelectorAll('div[class*="container"] div[class="spec"]');
            for (let i = 0; i < specDivs.length; i++) {
              if (specDivs[i].querySelector('span[class*="val"]') && specDivs[i].querySelector('span[class*="val"]').innerText !== '') { specsText += specDivs[i].querySelector('span[class*="title"]').innerText + ' || ' + specDivs[i].querySelector('span[class*="val"]').innerText + ' || '; }
              if (specDivs[i].querySelector('b') && specDivs[i].querySelector('b').innerText !== '') { specsText += specDivs[i].querySelector('p').innerText + ' || '; }
            }
          }
          addHiddenDiv('specsDiv', specsText);
        });
        return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
      } catch (error) {
        console.log('could not load page', error);
      }
    }
  }
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'ebay',
    transform,
    domain: 'ebay.com',
    zipcode: '',
  },
  implementation,
};
