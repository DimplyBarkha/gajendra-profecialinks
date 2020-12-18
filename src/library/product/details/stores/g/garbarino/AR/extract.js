const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AR',
    store: 'garbarino',
    transform,
    domain: 'garbarino.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      await new Promise(resolve => setTimeout(resolve, 8000));
      // let enhancedContent = document.querySelector('div#flix-inpage'); 
      let enhancedContent = document.querySelector('div#flix-std-inpage'); 
      let enhancedDesc = enhancedContent ? enhancedContent.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').replace(/-->/, '').replace(/\s\|\|\s\|\|\s/gm,'').trim() : '';
      addHiddenDiv('gb_enhancedContent',enhancedDesc);
      let descriptionContent = document.querySelector('div#gb-description');
      let description = descriptionContent ? descriptionContent.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').replace('Descripción del producto','').replace(/-->/, '').replace(/\s\|\|\s\|\|\s/gm,'').trim() : '';
      addHiddenDiv('gb_description',description);
      let specTrs = document.querySelectorAll('div#gb-tech-spec ul li');
      let finalSpecArr = [];
      let fieldVal = '';
      let field;
      let value;
      for (let index = 0; index < specTrs.length; index++) {
        const element = specTrs[index];
        field = element.querySelector('h3.gb-tech-spec-module-list-title')
        // @ts-ignore
        let fieldStr = field ? field.innerText : '';
        value = element.querySelector('span.gb-tech-spec-module-list-description');
        // @ts-ignore
        let valueStr = value ? value.innerText : '';
        if(fieldStr && valueStr){
          let fieldVal = fieldStr+' : '+valueStr;
          finalSpecArr.push(fieldVal);
        }
      }
      let finalSpecStr;
      if(finalSpecArr.length > 0){
        finalSpecStr = finalSpecArr.join(' || ');
      }
      addHiddenDiv('gb_specification',finalSpecStr );
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
