const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    transform: cleanUp,
    domain: 'booker.co.uk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const cookies = await context.evaluate(async () => {
      return document.querySelector('input#EUCookieButton');
    });
    if (cookies) {
      await context.click('input#EUCookieButton');
    };
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.evaluate(async function () {
      // function to append the elements to DOM
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // Get productUrl
      const productUrl = window.location.href;
      addElementToDocument('productUrl', productUrl);
      // Get metakeywords
      const metaKeyword = document.querySelector('meta[name="keywords"]') ? document.querySelector('meta[name="keywords"]').getAttribute('content') : '';
      addElementToDocument('metaKeyword', metaKeyword);

      // Get availability text
      const availabilityNode = document.evaluate('//div[@class="product-price"]//span[contains(text(),"Add to List")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const availability = availabilityNode && availabilityNode.singleNodeValue ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availability', availability);

      // Get terms and conditions
      const tandc = document.querySelector('div#links a[href*="terms"]') ? 'Yes' : 'No';
      addElementToDocument('tandc', tandc);

      // Get privacy policy
      const privacyPolicy = document.querySelector('div#links a[href*="privacy"]') ? 'Yes' : 'No';
      addElementToDocument('privacyPolicy', privacyPolicy);

      // Get allergy advice
      const allergens = document.evaluate("//div[@id='categories']//p[span[contains(text(),'Allergy Advice')]]", document, null, XPathResult.ANY_TYPE, null);
      var allergensArray = [];
      let allergen = allergens.iterateNext();
      while (allergen) {
        allergensArray.push(allergen.textContent);
        allergen = allergens.iterateNext();
      }
      addElementToDocument('allergens', allergensArray.join(', ').replace(/By Allergy Advice: /g, ''));
      // Get serving size table
      const servingSizeColumns = document.querySelectorAll('div.desplegabledesktop div[data-parent="#nutrition"] tr th');
      if (servingSizeColumns) {
        for (let i = 0; i < servingSizeColumns.length; i++) {
          if (servingSizeColumns[i] && servingSizeColumns[i].textContent.match(/100/g)) {
            const caloriesRow = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"nergy")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const caloriesPerServing = caloriesRow && caloriesRow.querySelectorAll('td')[i] ? caloriesRow.querySelectorAll('td')[i].textContent : '';
            addElementToDocument('caloriesPerServing', caloriesPerServing);
            const totalFatRow = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Fat") or contains(.,"fat")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const totalFatPerServing = totalFatRow && totalFatRow.querySelectorAll('td')[i] ? totalFatRow.querySelectorAll('td')[i].textContent : '';
            addElementToDocument('totalFatPerServing', totalFatPerServing);
            const saturatedFatRow = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Fat") or contains(.,"fat")]/following-sibling::*[contains(.,"saturate")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const saturatedFatPerServing = saturatedFatRow && saturatedFatRow.querySelectorAll('td')[i] ? saturatedFatRow.querySelectorAll('td')[i].textContent : '';
            addElementToDocument('saturatedFatPerServing', saturatedFatPerServing);
            const sodiumRow = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Sodium") or contains(.,"sodium")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const sodiumPerServing = sodiumRow && sodiumRow.querySelectorAll('td')[i] ? sodiumRow.querySelectorAll('td')[i].textContent : '';
            addElementToDocument('sodiumPerServing', sodiumPerServing);
            const carbRow = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Carb") or contains(.,"carb")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const carbPerServing = carbRow && carbRow.querySelectorAll('td')[i] ? carbRow.querySelectorAll('td')[i].textContent : '';
            addElementToDocument('carbPerServing', carbPerServing);
            const fibreRow = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Fibre") or contains(.,"fibre")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const fibrePerServing = fibreRow && fibreRow.querySelectorAll('td')[i] ? fibreRow.querySelectorAll('td')[i].textContent : '';
            addElementToDocument('fibrePerServing', fibrePerServing);
            const sugarRow = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Sugar") or contains(.,"sugar")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const sugarPerServing = sugarRow && sugarRow.querySelectorAll('td')[i] ? sugarRow.querySelectorAll('td')[i].textContent : '';
            addElementToDocument('sugarPerServing', sugarPerServing);
            const proteinRow = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Protein") or contains(.,"protein")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const proteinPerServing = proteinRow && proteinRow.querySelectorAll('td')[i] ? proteinRow.querySelectorAll('td')[i].textContent : '';
            addElementToDocument('proteinPerServing', proteinPerServing);
            const calciumRow = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Calcium") or contains(.,"calcium")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const calciumPerServing = calciumRow && calciumRow.querySelectorAll('td')[i] ? calciumRow.querySelectorAll('td')[i].textContent : '';
            addElementToDocument('calciumPerServing', calciumPerServing);
            const saltRow = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Salt") or contains(.,"salt")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const saltPerServing = saltRow && saltRow.querySelectorAll('td')[i] ? saltRow.querySelectorAll('td')[i].textContent : '';
            addElementToDocument('saltPerServing', saltPerServing);
            const magnesiumRow = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Magnesium") or contains(.,"magnesium")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const magnesiumPerServing = magnesiumRow && magnesiumRow.querySelectorAll('td')[i] ? magnesiumRow.querySelectorAll('td')[i].textContent : '';
            addElementToDocument('magnesiumPerServing', magnesiumPerServing);
          } else if (servingSizeColumns.length === 2 && !servingSizeColumns[1].textContent.match(/er\s100/g)) {
            const caloriesPerServing = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"nergy")]//td[position()=last()]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (caloriesPerServing) addElementToDocument('caloriesPerServing', caloriesPerServing.textContent);
            const totalFatPerServing = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Fat") or contains(.,"fat")]//td[position()=last()]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (totalFatPerServing) addElementToDocument('totalFatPerServing', totalFatPerServing.textContent);
            const saturatedFatPerServing = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Fat") or contains(.,"fat")]/following-sibling::*[contains(.,"saturate")]//td[position()=last()]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (saturatedFatPerServing) addElementToDocument('saturatedFatPerServing', saturatedFatPerServing.textContent);
            const sodiumPerServing = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Sodium") or contains(.,"sodium")]//td[position()=last()]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (sodiumPerServing) addElementToDocument('sodiumPerServing', sodiumPerServing.textContent);
            const proteinPerServing = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Protein") or contains(.,"protein")]//td[position()=last()]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (proteinPerServing) addElementToDocument('proteinPerServing', proteinPerServing.textContent);
            const calciumPerServing = document.evaluate('//div[@class="desplegabledesktop"]//div[@data-parent="#nutrition"]//tbody//tr[contains(.,"Calcium") or contains(.,"calcium")]//td[position()=last()]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (calciumPerServing) addElementToDocument('calciumPerServing', calciumPerServing.textContent);
          }
        }
      }
    });
    await context.extract(productDetails, { transform });
  },
};
