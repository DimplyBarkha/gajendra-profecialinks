
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
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        }
        let descPara = document.querySelectorAll('div[id="tabs-1"] p');
        let desArr = [];
        let desArrFinal = [];
        let descParaz;
        for (let index = 0; index < descPara.length; index++) {
          // @ts-ignore
          let ele = descPara[index].innerText;
          desArr.push(ele);
        }
        descParaz = desArr.join(' ');
        if(descParaz){
          desArrFinal.push(descParaz);
        }
        let desBullets = document.querySelectorAll('div[id="tabs-1"] ul li');
        for (let index = 0; index < desBullets.length; index++) {
          // @ts-ignore
          const element = desBullets[index].innerText;
          desArrFinal.push(element);
        }
        addHiddenDiv('description', desArrFinal.join(' || '));
        addHiddenDiv('descriptionBulletsCount', desBullets.length );
        let enhancedContent = document.querySelector('div#flix-inpage');
        // @ts-ignore
        enhancedContent = enhancedContent ? enhancedContent.innerText.replace(/(\s*[\r\n]\s*)+/g, ' ').trim() : '';
        addHiddenDiv('enhancedContent', enhancedContent);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
