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
  const { productDetails, Helpers: { Helpers }, AmazonHelp: { AmazonHelp } } = dependencies;

  const helpers = new Helpers(context);
  const amazonHelp = new AmazonHelp(context, helpers);

  async function loadAllResources (timeout = 40000) {
    const loadManufacturerSelectors = async () => ((document.querySelector('div#dpx-aplus-product-description_feature_div') !== null) || (document.querySelector('div#aplus_feature_div div#aplus') !== null));

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

    const loadImportantInfoSelectors = async () => ((document.querySelector('div#dpx-default-important-information_feature_div div#importantInformation_feature_div') !== null));
    const loadImportantInfo = await context.evaluate(loadImportantInfoSelectors);
    if (loadImportantInfo) {
      try {
        await context.waitForSelector('div#important-information', { timeout: 5000 });
      } catch (err) {
        console.log('Could not load div#important-information');
      }
    }
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
      const manufContent = document.querySelector('div#aplus');
      let manufContentText = '';
      if (manufContent) {
        const clonedManufContent = manufContent.cloneNode(true);
        if (clonedManufContent.getElementsByTagName("style")) {
          [...clonedManufContent.getElementsByTagName("style")].forEach((styleElement) => styleElement.remove());
        }
        if (clonedManufContent.getElementsByTagName("script")) {
          [...clonedManufContent.getElementsByTagName("script")].forEach((scriptElement) => scriptElement.remove());
        }
        manufContentText = clonedManufContent.innerHTML.replace(/<(li)[^>]+>/ig, '<$1>').replace(/<li>/gm, ' || ').replace(/<[^>]*>/gm, '').trim();
      }
      addHiddenDiv('added-enhanced-content', (manufContent ? manufContentText : '') + allText);
      if (parentInput) {
        addHiddenDiv('added-parentInput', parentInput);
      }
    }, parentInput);
  }

  await new Promise(resolve => setTimeout(resolve, 5000));
  await amazonHelp.setLocale('90210');
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
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
