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
    try {
      await this.context.waitForSelector('div.ui-tabs_tab-content', { timeout: 5000 });
    } catch (error) {
    }
    try {
      await this.context.waitForSelector('div.ui-tabs_tab-content div', { timeout: 5000 });
    } catch (error) {
    }
    await context.evaluate(async function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      var xPathRes = document.evaluate("//div[@class=\"ui-tabs_header-inner\"]/a[contains(text(),'Ostrzeżenia i pozostałe informacje')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      try {
        // @ts-ignore
        xPathRes.singleNodeValue.click();
        let tabContent1 = document.evaluate("//div[@class='ui-tabs_tab-content']/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let content = tabContent1.textContent;
        addHiddenDiv('wid', content);
      } catch (error) {
      }
      try {
        let content;
        let fourthContent = '';
        var xPathRes10 = document.evaluate("//div[@class=\"ui-tabs_header-inner\"]/a[contains(text(),'Opis produktu')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (xPathRes10) {
          // @ts-ignore
          xPathRes10.singleNodeValue.click();
          let tabContent1 = document.evaluate("//div[@class='ui-tabs_tab-content']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let firstContent = tabContent1.textContent;
          content = firstContent;
          try {
            var xPathRes3 = document.evaluate("//div[@class=\"ui-tabs_header-inner\"]/a[contains(text(),'Opakowanie')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            // @ts-ignore
            xPathRes3.singleNodeValue.click();
            await new Promise((resolve, reject) => setTimeout(resolve, 3000));
            let tabContent = document.evaluate("//div[@class='ui-tabs_tab-content']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            fourthContent = tabContent.textContent;
          } catch (error) {
          }
          content = firstContent + fourthContent;
          // console.log("content ::" + content);
          addHiddenDiv('addDescid', content);
        }
      } catch (error) {
      }
      var xPathRes4 = document.evaluate("//div[@class=\"ui-tabs_header-inner\"]/a[contains(text(),'Informacje producenta')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      try {
        // @ts-ignore
        xPathRes4.singleNodeValue.click();
        let tabContent = document.evaluate("//h3[contains(text(),'Opis produktu')]/following::p[1]/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let fifthContent = tabContent.textContent;
        addHiddenDiv('mid', fifthContent);
      } catch (error) {
      }
      var xPathRes5 = document.evaluate("//div[@class=\"ui-tabs_header-inner\"]/a[contains(text(),'Przygotowywanie i przechowywanie')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      try {
        // @ts-ignore
        xPathRes5.singleNodeValue.click();
        let tabContent = document.evaluate("//h3[contains(text(),'Przygotowanie i stosowanie')]/following::p[1]/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let thirdContent = tabContent.textContent;
        addHiddenDiv('did', thirdContent);
      } catch (error) {
      }
      var xPathRes6 = document.evaluate("//div[@class=\"ui-tabs_header-inner\"]/a[contains(text(),'Wartości odżywcze')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      try {
        // @ts-ignore
        xPathRes6.singleNodeValue.click();
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
      var xPathRes7 = document.evaluate("//div[@class=\"ui-tabs_header-inner\"]/a[contains(text(),'Składniki')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      try {
        // @ts-ignore
        xPathRes7.singleNodeValue.click();
        let tabContent = document.evaluate("//div[@class='ui-tabs_tab-content']/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let tabContent1 = document.evaluate("//h3[contains(text(),'Zalecenia dla alergików')]/following::table/tbody", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let componentInfo = tabContent.textContent;
        let allergyInfo = tabContent1.textContent;
        addHiddenDiv('componentid', componentInfo);
        addHiddenDiv('aid', allergyInfo);
      } catch (error) {
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
      }
      //To get availability details
      let availabilityText;
      let availability = document.evaluate("//div[@itemprop='availability']/@content", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (availability) {
        try {
          if (availability.textContent.includes('InStock')) {
            availabilityText = "IN Stock";
          } if (availability.textContent.includes('OutOfStock')) {
            availabilityText = "Out of Stock";
          }
          addHiddenDiv('avaid', availabilityText);
        } catch (error) {
        }
      }
    });
    return await context.extract(productDetails, { transform });
  }
};