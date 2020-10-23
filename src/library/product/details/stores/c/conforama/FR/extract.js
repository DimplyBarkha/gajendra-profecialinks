
const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'conforama',
    transform,
    domain: 'conforama.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }catch(error){
        console.log(error)
      }
      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }catch(error){
        console.log(error)
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        }
       
        let des= document.querySelector('div[id="tabs-1"]');
        // @ts-ignore
        let des1 = des ? des.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').replace('Description du produit','').replace('La marque vous parle La marque vous parle','').trim() : '';
        let des2 = des1 ? des1.split("La marque vous parle") : '';
        des2 = des2 ? des2[0] : '';
        console.log('des2: ', des2);
        addHiddenDiv('co_description',des2);
        let enhancedContent = document.querySelector('div#flix-inpage');
        // @ts-ignore
        enhancedContent = enhancedContent ? enhancedContent.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
        // @ts-ignore
        addHiddenDiv('enhancedContent', enhancedContent);
        let specTrs = document.querySelectorAll('table.productSpecifications tr');
        let finalSpecArr = [];
        let fieldVal = '';
        let field;
        let value;
        for (let index = 0; index < specTrs.length; index++) {
          const element = specTrs[index];
          let tds = element.querySelectorAll('td');
          if(tds.length > 1){
            field = element.querySelector('td:nth-child(1)')
            // @ts-ignore
            let fieldStr = field ? field.innerText : '';
            value = element.querySelector('td:nth-child(2)');
            // @ts-ignore
            let valueStr = value ? value.innerText : '';
            if(fieldStr && valueStr){
              let fieldVal = fieldStr+' : '+valueStr;
              finalSpecArr.push(fieldVal);
            }
          }

        }
        let finalSpecStr
        if(finalSpecArr.length > 0){
          finalSpecStr = finalSpecArr.join(' || ');
        }
        addHiddenDiv('cr_specification',finalSpecStr );
        async function findJsonObj () {
          try {
            const xpath = `//script[contains(.,'"brand": {')]`;
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let jsonStr = element.textContent;
            jsonStr = jsonStr.trim();
            return JSON.parse(jsonStr);
          } catch (error) {
            console.log(error.message);
          }
        }
        let JSONp = await findJsonObj();
        console.log('JSON: ', JSONp);
        let brand = JSONp ? JSONp.brand : '';
        console.log('brand: ', brand);
        let brandText = brand ? brand.name : '';
        console.log('brandText: ', brandText);
        addHiddenDiv('cr_brandText',brandText );
      
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
