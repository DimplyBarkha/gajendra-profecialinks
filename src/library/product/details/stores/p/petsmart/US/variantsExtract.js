async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  // await new Promise((resolve) => setTimeout(resolve, 30000));
  // await context.evaluate(async () => {
  //   const clickButton = document.querySelector('#dp-header > div.row.mobile-header > div.dp-promo2 > div > section > a > div');
  //   if (clickButton) {
  //     clickButton.click();
  //     await new Promise((resolve) => setTimeout(resolve, 20000));
  //   }
  // })
  // await new Promise((resolve) => setTimeout(resolve, 70000));
  // const addOptionalwait = async (selector) => {
  //   try {
  //     await context.waitForSelector(selector, { timeout: 30000 });
  //     console.log(`${selector} did not load at all`)
  //   } catch (e) {
  //     console.log(`${selector} loaded successfully`)
  //   }
  // }
  await new Promise((resolve) => setTimeout(resolve, 70000));
  await context.evaluate(() => {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const urlArray = [];
    scripts.forEach((element) => {
      let jsonData = JSON.parse(element && element.innerText);
      urlArray.push(jsonData && jsonData.url);
    })
    const rpcArray = []
    urlArray.forEach((element) => { rpcArray.push(element.match(/\d+/g) && element.match(/\d+/g)[0]) });
    rpcArray.forEach((element, index) => {
      const variantElement = document.createElement('div');
      variantElement.className = 'variantinfo'
      variantElement.setAttribute('variantid', rpcArray[index]);
      document.body.append(variantElement)
    })
  })
  return await context.extract(variants, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'petsmart',
    transform: null,
    domain: 'petsmart.com',
    zipcode: "",
  },
  implementation,
};
