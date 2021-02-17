async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { timeout = 10000 } = parameters;
  const { url, zipcode, storeId } = inputs;
  // await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true, captureRequests: true });

  let lastResponseData;
  const run = async () => {
    lastResponseData = await context.goto(url, {
      timeout,
      waitUntil: 'load',
      checkBlocked: true,
      captureRequests: true,
    });
    console.log('first responseData: ' + lastResponseData.status);
    if (lastResponseData.status === 404 || lastResponseData.status === 410) {
      return;
    }

    if (lastResponseData.status === 400) {
      // throw Error('Bad response code: ' + lastResponseData.code);
      return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
    }

    if (lastResponseData.status !== 200) {
      lastResponseData = await context.goto(url, {
        timeout,
        waitUntil: 'load',
        checkBlocked: true,
        captureRequests: true,
      });
      console.log('retry for goto responseData: ' + lastResponseData.status);
    }
  };

  try {
    await run();
  } catch (e) {
    console.log('error in goto url');
  }

  // patch for synchronicity issue between json decoring and goto result
  if (url.split('[!opt!]')[1] && url.split('[!opt!]')[1].includes('"type":"json"')) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  console.log(`zipcode: ${zipcode}`);
  if (zipcode || storeId) {
    await dependencies.setZipCode(inputs);
  }
}

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'discoverglo.co.kr',
    timeout: 500000,
    jsonToTable: null,
    country: 'KO',
    store: 'discoverglo',
    zipcode: '',
  },
  implementation,
};
