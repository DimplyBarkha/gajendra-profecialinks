const { transform } = require("../../../../shared");

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs:: ", inputs);
  const { url, id } = inputs;
  console.log("parameters:: ", parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForXPath('//a[@class="text-medium ShopLink"]');

    await context.waitForSelector("a.text-medium");
    console.log("everything fine !!!");
    await context.evaluate(() => {
      const firstItem = document.querySelector("a.text-medium");
      firstItem.click();
    });
    console.log("everything fine !!! 2");
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));

  await context.evaluate(async function () {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement("div");
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = "none";
      document.body.appendChild(newDiv);
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

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "US",
    store: "att",
    transform: transform,
    domain: "att.com",
    zipcode: "''",
  },
  implementation,
};
