const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bedbathbeyond',
    transform: cleanUp,
    domain: 'bedbathbeyond.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    await context.evaluate(async () => {
      const body = document.querySelector('body');
      const descriptionElement = document.querySelector('div#overview div[itemprop="description"]');
      const descriptionLiElements = document.querySelectorAll('div#overview ul li');
      let descriptionText = descriptionElement ? descriptionElement.innerHTML : '';
      const descriptionLiTexts = [];
      descriptionLiElements.forEach(li => {
        descriptionLiTexts.push(li.innerHTML);
      });
      descriptionText += ' || ' + descriptionLiTexts.join(' || ');
      body.setAttribute('description', descriptionText);
    });

    await context.click('div#pdpNavigations a[href="#reviews"]');
    // await context.waitForXPath('//section[@id="reviews"]/div/div[1]/div[1]/div/div[1]/div[1]');
    await context.waitForNavigation();
    const loadMoreButton = await context.evaluate(async () => {
      return document.querySelector('div#wc-read-button');
    });
    if (loadMoreButton) {
      await context.click('div#wc-read-button');
    }
    await context.click('img[class*="ProductMediaCarouselStyle"]');

    const { transform } = parameters;
    const { productDetails } = dependencies;
    var extractedData = await context.extract(productDetails, { transform });

    var mpc = extractedData[0].group[0].mpc;
    if (mpc && mpc[0].text.includes(' ')) {
      const mpcArray = mpc[0].text.split(' ');
      const mpcFinalFormat = mpcArray.filter(element => {
        return !element.includes('(');
      }).join(', ');
      mpc[0].text = mpcFinalFormat;
    }

    var color = extractedData[0].group[0].color;
    if (color && color.length > 1) {
      const colorFinalFormat = color.map(element => {
        return element.text;
      }).join(', ');
      color[0].text = colorFinalFormat;
      color.splice(1);
    }

    var manufacturerDesc = extractedData[0].group[0].manufacturerDescription;
    if (manufacturerDesc && manufacturerDesc.length > 1) {
      const manufacturerDescFinalFormat = manufacturerDesc.map(element => {
        return element.text;
      }).join(' ');
      manufacturerDesc[0].text = manufacturerDescFinalFormat;
      manufacturerDesc.splice(1);
    }
  },
};
