async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { timeout = 10000 } = parameters;
  const { url, zipcode, storeId } = inputs;
  await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true, captureRequests: true });

  // patch for synchronicity issue between json decoring and goto result
  if (url.split('[!opt!]')[1] && url.split('[!opt!]')[1].includes('"type":"json"')) {
    console.log('Wait for handling synchronicity issue');
    await new Promise((resolve) => setTimeout(resolve, 8000));
  }

  console.log(`zipcode: ${zipcode}`);
  if (zipcode || storeId) {
    await dependencies.setZipCode(inputs);
  }

  const isSelectorAvailable = async (cssSelector) => {
    return await context.evaluate(function (selector) {
      return !!document.querySelector(selector);
    }, cssSelector);
  };
  try {
    await context.waitForSelector('button.b_popup_agreement-button--yes', { timeout: 10000 });
  } catch (e) {
    console.log('age confirmation not loaded');
  }
  await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    const ageButtonAvailable = await isSelectorAvailable('button.b_popup_agreement-button--yes');
    if (ageButtonAvailable) {
      await context.click('button.b_popup_agreement-button--yes');
    }
  } catch (e) {
    console.log('error in click age confirmation');
  }
}

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'vardex.ru',
    timeout: null,
    jsonToTable: null,
    country: 'RU',
    store: 'vardex',
    zipcode: '',
  },
  implementation,
};
