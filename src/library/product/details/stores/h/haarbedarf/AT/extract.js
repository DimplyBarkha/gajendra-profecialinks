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
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (document.querySelector('li[class*="additional_information"]')) {
        const listItem = document.querySelector('li[class*="additional_information"]');
        listItem.querySelector('a').click();
        const tbl = document.querySelector('table[class*="product-attributes"]');
        const tblRows = tbl.querySelectorAll('tr');
        let specsString = '';
        for (let i = 0; i < tblRows.length; i++) {
          specsString += tblRows[i].querySelector('th').innerText + ' || ';
          specsString += tblRows[i].querySelector('td').innerText + ' || ';
        }
        console.log(specsString);
        addHiddenDiv('specs', specsString);
      }
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

      const breadcrumbs = document.querySelector('span.posted_in').innerText.replace(',', ' >').replace(',', ' >');
      document.querySelector('span.posted_in').setAttribute('breadcrums', breadcrumbs);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
