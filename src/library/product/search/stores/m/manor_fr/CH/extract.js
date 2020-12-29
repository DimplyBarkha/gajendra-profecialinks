const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'manor_fr',
    transform,
    domain: 'manor.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.getElementsByClassName(index)[0].appendChild(newDiv);
      }
      function addEmptyDiv(id) {
        const newDiv = document.createElement('div');
        newDiv.className = id;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function addElement(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      // Space Concatenation
      const pipeSeparatorSpace = (id, data, index) => {
        var singleSeparatorText = data.join(' ');
        addHiddenDiv(id, singleSeparatorText, index);
      };
      const url = window.location.href;
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
          addEmptyDiv(i);
          addHiddenDiv('id', data["finding"][i]["match-item"]["e:epoq_search_id"]["$"], i);
          addHiddenDiv('image', data["finding"][i]["match-item"]["c:imagelink"]["$"], i);
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
          pipeSeparatorSpace('name', name, i);
          name = [];
          addHiddenDiv('price', data["finding"][i]["match-item"]["c:pricevalue"]["$"], i);
          addHiddenDiv('rating', data["finding"][i]["match-item"]["c:averagerating"]["$"], i);
          addHiddenDiv('productURL', data["finding"][i]["match-item"]["link"]["$"], i);
          addHiddenDiv('added-searchurl', url, i);
        }
      } catch (error) {
        addElement('noresults', 'noresults')
      }
    });
    return await context.extract(productDetails, { transform });
  },
};

