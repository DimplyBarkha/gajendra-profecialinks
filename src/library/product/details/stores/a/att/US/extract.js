const { transform } = require('../../../../shared');
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "US",
    store: "att",
    transform: transform,
    domain: "att.com",
    zipcode: "''",
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.evaluate(async function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        return newDiv;
      }
      try {
        const videoSelector = '//script[@type="application/ld+json"][contains(text(),"VideoObject")]';
        const videoApis = document.evaluate(
          videoSelector,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        for (let i = 0; i < videoApis.snapshotLength; i++) {
          let text = videoApis.snapshotItem(i).textContent;
          let descTillEnd = text.substring(text.indexOf("description") - 1);
          let desc = descTillEnd.substring(0, descTillEnd.indexOf('",') + 2);
          text = text.replace(desc, '');
          addHiddenDiv('test-video', text);
          const videoObj = JSON.parse(text);

          if (videoObj && videoObj.contentUrl) {
            addHiddenDiv(`${i}-my-video`, videoObj.contentUrl);
          }
        }
      } catch (err) { }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
