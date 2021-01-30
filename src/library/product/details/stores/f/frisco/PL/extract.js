const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'frisco',
    transform: cleanUp,
    domain: 'frisco.pl',
  },
  implementation: async function implementation(
    // @ts-ignore
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;


    // @ts-ignore
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      // @ts-ignore
      await new Promise((resolve, reject) => setTimeout(resolve, 8000));
      const warningButton = document.getElementsByClassName('ui-tabs_tab  button')[5];

      if (warningButton && warningButton.textContent === 'Ostrzeżenia i pozostałe informacje') {
        // @ts-ignore
        warningButton.click();
        try {
          let tabContent = document.evaluate("//h3[contains(text(),'Pozostałe informacje')]/following::p[1]/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let fourthContent = tabContent.textContent;
          let content = "Pozostałe informacje " + fourthContent;
          addHiddenDiv('wid', content);
        } catch (error) {
        }
      }
      const warningButton1 = document.getElementsByClassName('ui-tabs_tab  button')[5];
      if (warningButton1 && warningButton1.textContent === 'Opakowanie') {
        // @ts-ignore
        warningButton1.click();
        try {
          let tabContent = document.evaluate("//h3[contains(text(),'Wymiar liczbowy')]/following::p[1]/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let fourthContent = tabContent.textContent;
          let tabContent1 = document.evaluate("//div[@class='ui-tabs_tab-content']/div/p", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let content = "Wymiar liczbowy " + fourthContent;
          let c=tabContent1.textContent;
          let addDesc= c + content;
          addHiddenDiv('addDescid', addDesc);
        } catch (error) {
        }
      }
      const manufacturerButton = document.getElementsByClassName('ui-tabs_tab  button')[5];

      if (manufacturerButton && manufacturerButton.textContent === 'Informacje producenta') {
        // @ts-ignore
        manufacturerButton.click();
        try {
          let tabContent = document.evaluate("//h3[contains(text(),'Opis produktu')]/following::p[1]/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let fifthContent = tabContent.textContent;
          addHiddenDiv('mid', fifthContent);
        } catch (error) {

        }
      }

      const preparationButton = document.getElementsByClassName('ui-tabs_tab  button')[3];

      if (preparationButton && preparationButton.textContent === 'Przygotowywanie i przechowywanie') {
        // @ts-ignore
        preparationButton.click();
        try {
          let tabContent = document.evaluate("//h3[contains(text(),'Przygotowanie i stosowanie')]/following::p[1]/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let thirdContent = tabContent.textContent;
          addHiddenDiv('did', thirdContent);
        } catch (error) {

        }
      }
      const nutritionButton = document.getElementsByClassName('ui-tabs_tab  button')[2];

      if (nutritionButton && nutritionButton.textContent === 'Wartości odżywcze') {
        // @ts-ignore
        nutritionButton.click();
        try {
          let tabContent = document.evaluate("//h3[contains(text(),'Obliczona wartość odżywcza')]//following::td[contains(text(),'Wartość energetyczna (kJ)')]/following::td[1]/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let tabContent1 = document.evaluate("//h3[contains(text(),'Obliczona wartość odżywcza')]//following::td[contains(text(),'Wartość energetyczna (kcal)')]/following::td[1]/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let tabContent2 = document.evaluate("//h3[contains(text(),'Obliczona wartość odżywcza')]//following::td[contains(text(),'Tłuszcz (g)')]/following::td[1]/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let tabContent3 = document.evaluate("//h3[contains(text(),'Obliczona wartość odżywcza')]//following::td[contains(text(),'Tłuszcz (g)')]/following::td[1]/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let tabContent4 = document.evaluate("//h3[contains(text(),'Obliczona wartość odżywcza')]//following::td[contains(text(),' w tym cukry (g)')]/following::td[1]/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

          let caloriesPerServing = tabContent.textContent;
          let caloriesFromFatPerServing = tabContent1.textContent;
          let totalFatPerServing = tabContent2.textContent;
          // @ts-ignore
          let totalFatPerServingUom = tabContent3.textContent;
          let tatalSugarPerServing = tabContent4.textContent;
          addHiddenDiv('cid', caloriesPerServing);
          addHiddenDiv('cpid', caloriesFromFatPerServing);
          addHiddenDiv('tfid', totalFatPerServing);
          addHiddenDiv('tfsid', totalFatPerServing);
          // addHiddenDiv('tfpuid',totalFatPerServingUom.slice)
          addHiddenDiv('tssid', tatalSugarPerServing)
        } catch (error) {

        }
      }

      const componentsButton = document.getElementsByClassName('ui-tabs_tab  button')[1];

      if (componentsButton && componentsButton.textContent === 'Składniki') {
        // @ts-ignore
        componentsButton.click();
        try {
          let tabContent = document.evaluate("//div[@class='ui-tabs_tab-content']/div/p", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let tabContent1 = document.evaluate("//h3[contains(text(),'Zalecenia dla alergików')]/following::table/tbody", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let componentInfo = tabContent.textContent;
          let allergyInfo = tabContent1.textContent;
          addHiddenDiv('componentid', componentInfo);
          addHiddenDiv('aid', allergyInfo);
        } catch (error) {
        }
      }
      const regex = "/"
      let pidhref = document.evaluate("//a[@class='button orange higher']/@href", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (pidhref) {
        try {
          let pidhrefTag = pidhref.textContent;
          let strArray = pidhrefTag.split(regex);
          let skuArr = strArray[1].split(","); //Take the second part.
          let sku = skuArr[1];
          addHiddenDiv('id1', sku);
        } catch (error) {
        }
      }      //To get availability details
      let availabilityText;
      let availability = document.evaluate("//div[@itemprop='availability']/@content", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (availability) {
        try {
          if (availability.textContent.includes('InStock')) {
            availabilityText = "IN Stock";
          } if (availability.textContent.includes('OutOfStock')) {
            availabilityText = "Out Of Stock";
          }
          addHiddenDiv('avaid', availabilityText);
        } catch (error) {
        }
      }
    });
    return await context.extract(productDetails, { transform });
  }
};