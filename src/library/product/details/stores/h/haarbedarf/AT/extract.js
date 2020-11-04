const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'haarbedarf',
    transform: cleanUp,
    domain: 'haarbedarf.at',
  },

  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    // await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForSelector('#tab-description');
    await context.evaluate(async function () {
      // Removing spaces between colors e.g. 'schwarz / nickel' to 'schwarz/nickel'
      const colorInH1 = document.querySelector('h1.product_title.entry-title');
      const newColorSlash = colorInH1.textContent.replace(/\s\/\s/, '/');
      colorInH1.innerHTML = newColorSlash;
      // Creating div with enchancedDescription with || separator
      const enchancedDescription = document.querySelectorAll('div#tab-description h3, div#tab-description p');
      const enchancedList = [];
      const enchancedDiv = document.createElement('div');
      enchancedDiv.setAttribute('class', 'enchanceddescription');
      enchancedDescription.forEach(element => {
        enchancedList.push(element.textContent);
      });
      enchancedDiv.textContent = enchancedList.join('||');
      document.body.appendChild(enchancedDiv);
      // Creating div with additionalDescBulletInfo with || separator
      const bulletInfoSelector = document.querySelectorAll('div.product-vorteil ul li');
      const bulletList = [];
      const bulletDiv = document.createElement('div');
      bulletDiv.setAttribute('class', 'descbulletinfo');
      bulletInfoSelector.forEach(element => {
        bulletList.push(element.textContent);
      });
      bulletDiv.textContent = bulletList.join('||');
      document.body.appendChild(bulletDiv);

      // Creating div with specifications with || separator

      const xpath = '(//h4[text()="Besonderheiten:"]/following-sibling::ul)[1]/li';
      const specList = [];
      const specDiv = document.createElement('div');
      specDiv.setAttribute('class', 'added_specifications');
      const specSelector = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let index = 0; index < specSelector.snapshotLength; index++) {
        const element = specSelector.snapshotItem(index);
        specList.push(element.textContent);
      }
      specDiv.textContent = specList.join('||');
      document.body.appendChild(specDiv);

      const breadcrumbs = document.querySelector('span.posted_in').innerText.replace(',', ' >').replace(',', ' >');
      document.querySelector('span.posted_in').setAttribute('breadcrums', breadcrumbs);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
