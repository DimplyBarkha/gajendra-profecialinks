const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    transform: transform,
    domain: 'manor.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }


      // Space Concatenation
      const pipeSeparatorSpace = (id, data) => {
        var singleSeparatorText = data.join(' ');
        addHiddenDiv(id, singleSeparatorText);
      };
      var name = [];
      let data = document.querySelector('pre').innerText;
      data = data.replace(/null\(/g, '');
      data = data.replace(');', '');
      data = JSON.parse(data);
      try {
        // @ts-ignore
        data = data.result.findings;
        // @ts-ignore
        for (let i = 0; i < data.finding.length; i++) {
          addHiddenDiv('id', data["finding"][i]["match-item"]["e:epoq_search_id"]["$"]);
          addHiddenDiv('image', data["finding"][i]["match-item"]["c:imagelink"]["$"]);
          try {
            if (data["finding"][i]["match-item"]["c:productTitleFirstLine"]["$"]) {
              name.push(data["finding"][i]["match-item"]["c:productTitleFirstLine"]["$"]);
            }
          } catch (error) {

          }
          try {
            if (data["finding"][i]["match-item"]["c:productTitleSecondLine"]["$"]) {
              name.push(data["finding"][i]["match-item"]["c:productTitleSecondLine"]["$"]);
            }
          } catch (error) {

          }
          try {
            if (data["finding"][i]["match-item"]["c:productTitleThirdLine"]["$"]) {
              name.push(data["finding"][i]["match-item"]["c:productTitleThirdLine"]["$"]);
            }
          } catch (error) {

          }
          pipeSeparatorSpace('name', name);
          name = [];
          addHiddenDiv('price', data["finding"][i]["match-item"]["c:pricevalue"]["$"]);
          addHiddenDiv('rating', data["finding"][i]["match-item"]["c:averagerating"]["$"]);
          addHiddenDiv('productURL', data["finding"][i]["match-item"]["link"]["$"]);
        }
      } catch (error) {
        addHiddenDiv('noresults', 'noresults')
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
    });
    return await context.extract(productDetails, { transform });
  },
};
