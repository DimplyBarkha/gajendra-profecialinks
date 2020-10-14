const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BG',
    store: 'ebag',
    transform,
    domain: 'ebag.bg',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      // Check if nutrition tab is present
      const liCount = await context.evaluate(function () {
        const liSelector = Array.from(document.querySelectorAll('li[class*=react-tabs__tab]'));
        if (liSelector.length === 4) {
          return true;
        } else {
          return false;
        }
      });

      if (liCount) {
        // Navigate to nutrition value tab
        await new Promise(resolve => setTimeout(resolve, 5000));
        await context.click('li#react-tabs-2');
        await context.waitForSelector('div[class*=energy-values]');

        await context.evaluate(async () => {
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }

          // Fetch nutrition values
          const caloriesPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(1) > td:nth-child(2)');
          const cal = caloriesPerServ && caloriesPerServ.innerHTML ? caloriesPerServ.innerHTML : '';
          addHiddenDiv('caloriesPerServ', cal);

          const totalFatPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(4) > td:nth-child(2)');
          const fat = totalFatPerServ && totalFatPerServ.innerHTML ? totalFatPerServ.innerHTML : '';
          addHiddenDiv('totalFatPerServ', fat);

          const saturatedFatPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(5) > td:nth-child(2)');
          const sfat = saturatedFatPerServ && saturatedFatPerServ.innerHTML ? saturatedFatPerServ.innerHTML : '';
          addHiddenDiv('saturatedFatPerServ', sfat);

          const totalCarbPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(2) > td:nth-child(2)');
          const carb = totalCarbPerServ && totalCarbPerServ.innerHTML ? totalCarbPerServ.innerHTML : '';
          addHiddenDiv('totalCarbPerServ', carb);

          const totalSugarsPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(3) > td:nth-child(2)');
          const sugar = totalSugarsPerServ && totalSugarsPerServ.innerHTML ? totalSugarsPerServ.innerHTML : '';
          addHiddenDiv('totalSugarsPerServ', sugar);

          const proteinPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(6) > td:nth-child(2)');
          const protein = proteinPerServ && proteinPerServ.innerHTML ? proteinPerServ.innerHTML : '';
          addHiddenDiv('proteinPerServ', protein);

          const saltPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(7) > td:nth-child(2)');
          const salt = saltPerServ && saltPerServ.innerHTML ? saltPerServ.innerHTML : '';
          addHiddenDiv('saltPerServ', salt);
        });
        // Navigate to description tab
        await context.click('li#react-tabs-0');
        await context.waitForSelector('div[class*=description]');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (e) {
      console.log(e);
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    return await context.extract(productDetails, { transform });
  },
};
