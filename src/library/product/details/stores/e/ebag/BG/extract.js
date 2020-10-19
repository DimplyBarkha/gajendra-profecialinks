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
          const caloriesPerServUom = document.querySelector('div[class*=energy-values]  tr:nth-child(1) > td:nth-child(1)');
          let cal = caloriesPerServ && caloriesPerServ.innerHTML ? caloriesPerServ.innerHTML : '';
          const calUom = caloriesPerServUom && caloriesPerServUom.innerHTML ? caloriesPerServUom.innerHTML.replace(/Енергийност \(([^)]+)\)/g, '$1') : '';
          cal = cal + ' ' + calUom;
          addHiddenDiv('caloriesPerServ', cal);

          const totalCarbPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(2) > td:nth-child(2)');
          const carb = totalCarbPerServ && totalCarbPerServ.innerHTML ? totalCarbPerServ.innerHTML : '';
          addHiddenDiv('totalCarbPerServ', carb);
          if (carb) {
            const carbUom = 'r';
            addHiddenDiv('carb_uom', carbUom);
          }

          const totalSugarsPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(3) > td:nth-child(2)');
          const sugar = totalSugarsPerServ && totalSugarsPerServ.innerHTML ? totalSugarsPerServ.innerHTML : '';
          addHiddenDiv('totalSugarsPerServ', sugar);
          if (sugar) {
            const sugarUom = 'r';
            addHiddenDiv('sugar_uom', sugarUom);
          }

          const totalFatPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(4) > td:nth-child(2)');
          const fat = totalFatPerServ && totalFatPerServ.innerHTML ? totalFatPerServ.innerHTML : '';
          addHiddenDiv('totalFatPerServ', fat);
          if (fat) {
            const fatUom = 'r';
            addHiddenDiv('fat_uom', fatUom);
          }

          if (document.querySelector('div[class*=energy-values]  tr:nth-child(5) > td:nth-child(1)').innerHTML.includes('които наситени')) {
            const saturatedFatPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(5) > td:nth-child(2)');
            const sfat = saturatedFatPerServ && saturatedFatPerServ.innerHTML ? saturatedFatPerServ.innerHTML : '';
            addHiddenDiv('saturatedFatPerServ', sfat);
            if (sfat) {
              const sfatUom = 'r';
              addHiddenDiv('sfat_uom', sfatUom);
            }
          } else {
            const proteinPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(5) > td:nth-child(2)');
            const protein = proteinPerServ && proteinPerServ.innerHTML ? proteinPerServ.innerHTML : '';
            addHiddenDiv('proteinPerServ', protein);
            if (protein) {
              const proteinUom = 'r';
              addHiddenDiv('protein_uom', proteinUom);
            }
          }

          if (document.querySelector('div[class*=energy-values]  tr:nth-child(6) > td:nth-child(1)') && document.querySelector('div[class*=energy-values]  tr:nth-child(6) > td:nth-child(1)').innerHTML.includes('Протеини')) {
            const proteinPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(6) > td:nth-child(2)');
            const protein = proteinPerServ && proteinPerServ.innerHTML ? proteinPerServ.innerHTML : '';
            addHiddenDiv('proteinPerServ', protein);
            if (protein) {
              const proteinUom = 'r';
              addHiddenDiv('protein_uom', proteinUom);
            }
          }

          const saltPerServ = document.querySelector('div[class*=energy-values]  tr:nth-child(7) > td:nth-child(2)');
          const salt = saltPerServ && saltPerServ.innerHTML ? saltPerServ.innerHTML : '';
          addHiddenDiv('saltPerServ', salt);
          if (salt) {
            const saltUom = 'r';
            addHiddenDiv('salt_uom', saltUom);
          }
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
