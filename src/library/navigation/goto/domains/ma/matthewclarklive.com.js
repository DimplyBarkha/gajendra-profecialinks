
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'matthewclarklive.com',
    timeout: 500000,
    country: 'UK',
    store: 'matthewclarklive',
    zipcode: '',
  },
implementation: async (
  { url },
  parameters,
  context,
  dependencies,
) => {
  const timeout = parameters.timeout ? parameters.timeout : 10000;

  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  await context.setJavaScriptEnabled(true);
  await context.setAntiFingerprint(false);
  await context.setUseRelayProxy(false);
  const responseStatus = await context.goto(url, {
    firstRequestTimeout: 50000,
    timeout: timeout,
    waitUntil: 'load',
    checkBlocked: false,
    antiCaptchaOptions: {
      type: 'RECAPTCHA',
    },
  });
  console.log('Status :', responseStatus.status);
  console.log('URL :', responseStatus.url);
  try {
    // @ts-ignore
  document.querySelector('a[id="ctl00_cookiescontinuebutton"]').click()
  await new Promise(r => setTimeout(r, 50000));
  } catch (error) {
    
  }
}
};