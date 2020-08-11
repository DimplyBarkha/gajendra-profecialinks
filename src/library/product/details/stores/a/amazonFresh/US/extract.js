const { transform } = require('../../../../sharedAmazon/transform');
/**
 *
 * @param { { url?: string,  id?: string, parentInput?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */

async function implementation (
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails, Helpers: { Helpers } } = dependencies;
  const helpers = new Helpers(context);

  async function loadAllResources (timeout = 40000) {
    const loadManufacturerSelectors = async () => ((document.querySelector('div#dpx-aplus-product-description_feature_div') !== null) || (document.querySelector('div#aplus_feature_div div#aplus') !== null));
    const loadImportantInfoSelectors = async () => ((document.querySelector('div#dpx-default-important-information_feature_div div#importantInformation_feature_div') !== null));
  
    const loadManufacturer = await context.evaluate(loadManufacturerSelectors);
 
    let shouldLoadAplusBody = false;
    if (loadManufacturer) {
      try {
        await context.waitForSelector('div#aplus_feature_div div#aplus', { timeout });
        shouldLoadAplusBody = true;
      } catch (err) {
        console.log('Could not load div#aplus_feature_div div#aplus');
      }
      if (shouldLoadAplusBody) {
        try {
          await context.waitForSelector('div.aplus-v2', { timeout });
        } catch (err) {
          console.log('Could not load div.aplus-v2');
        }
      }
    }

    const loadImportantInfo = await context.evaluate(loadImportantInfoSelectors);
    if (loadImportantInfo) {
      try {
        await context.waitForSelector('div#important-information', { timeout: 5000 });
      } catch (err) {
        console.log('Could not load div#important-information');
      }
    }
  }

  async function setLocale () {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const shouldChangeAddress = await Helpers.checkAndReturnProp('div#nav-global-location-slot', 'css', 'innerText');

    if (shouldChangeAddress && shouldChangeAddress.includes('90210')) {
      return;
    }

    try {
      const wantedZip = '90210';
      await helpers.checkAndClick('span#glow-ingress-line2.nav-line-2', 'css', 6000);
      await helpers.checkAndClick('input[aria-label="or enter a US zip code"]', 'css', 6000, wantedZip);
      await helpers.checkAndClick('input[aria-labelledby="GLUXZipUpdate-announce"]', 'css', 6000);
      await helpers.checkAndClick('button[name="glowDoneButton"]', 'css', 6000);
    } catch (exception) {
      throw new Error('Failed to update zipcode!');
    }

    await new Promise(r => setTimeout(r, 5000));
  }

  async function addContent (parentInput) {
    await context.evaluate(async (parentInput) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      let allText = '';
      [...document.querySelectorAll('div.apm-hovermodule-slides')].filter(element => element.style.display !== "block").forEach((element) => {
        if (element.querySelector('.apm-hovermodule-slides-inner')) {
          allText += element.querySelector('.apm-hovermodule-slides-inner').innerText;
        }
      });
      addHiddenDiv('added-enhanced-content', document.querySelector('div#aplus') ? document.querySelector('div#aplus').innerText + allText : '');
      if (parentInput) {
        addHiddenDiv('added-parentInput', parentInput);
      }
    }, parentInput);
  }

  await new Promise(resolve => setTimeout(resolve, 5000));
  await setLocale();
  await context.waitForXPath('//div[@id="nav-global-location-slot"]//*[contains(text(), "90210")]');
 
  await loadAllResources();
  addContent(parentInput);
  console.log('autoscroll end');

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform: transform,
    domain: 'amazon.com',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
  },
  implementation,
};
