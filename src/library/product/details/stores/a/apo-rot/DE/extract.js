const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelector('div #pic_1');
      originalDiv.appendChild(newDiv);
    }

    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var script_text = scripts[i].text;
      if (script_text.trim().includes('gtin8')) { // local script text
        var gtinPatt = new RegExp(/\"gtin8": "(\d+)/);
        var gtinRes = gtinPatt.exec(script_text);
        addHiddenDiv('ii_gtin', gtinRes[1]);
      }
      if (script_text.trim().includes('@id')) {
        var urlPatt = new RegExp(/(\d+).html/);
        var urlRes = urlPatt.exec(script_text);
        console.log(urlRes);
        addHiddenDiv('ii_url', urlRes[1] + '.html');
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'apo-rot',
    transform: transform,
    domain: 'apo-rot.de',
    zipcode: "''",
  },
  implementation,
};
