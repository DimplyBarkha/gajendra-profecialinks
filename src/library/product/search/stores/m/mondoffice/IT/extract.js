async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.waitForSelector('#toolbar__all_anchor');
  await context.evaluate(async function () {
    const el = document.querySelector('body');
    el.setAttribute('search_url', location.href);
  });

  // Check if cookies pop-up appeared
  const doesPopupExist = await context.evaluate(function () {
    return Boolean(document.querySelector('#onetrust-accept-btn-handler'));
  });
  const doesPopupInfoExist = await context.evaluate(function () {
    return Boolean(document.querySelector('.kamPopup__overlay'));
  });

  if (doesPopupExist) {
    await context.click('#onetrust-accept-btn-handler');
  }
  if (doesPopupInfoExist) {
    await context.click('.kamPopup__close');
  }
  // try {
  //   await context.clickAndWaitForNavigation('.pagination-button__next', {}, { timeout: 30000 });
  // } catch (err) {
  //   console.log('Click & Navigation error' + err);
  // }
  // await context.goto('https://www.mondoffice.com/INTERSHOP/web/WFS/RAJA-MONDOFFICE-Site/it_IT/-/EUR/ViewParametricSearch-ProductPaging?PageNumber=1&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm=paper&SearchParameter=%26%40QueryTerm%3Dpaper%26MasterProductFlag%3D0%26SpecialProductFlag%3Dfalse#toolbar__all_anchor')
  // await context.goto('https://www.mondoffice.com/INTERSHOP/web/WFS/RAJA-MONDOFFICE-Site/it_IT/-/EUR/ViewParametricSearch-ProductPaging?PageNumber=2&PageSize=20&SortingAttribute=&ViewType=1&SearchTerm=paper&SearchParameter=%26%40QueryTerm%3Dpaper%26MasterProductFlag%3D0%26SpecialProductFlag%3Dfalse#toolbar__all_anchor')
  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    transform: null,
    domain: 'mondoffice.com',
    zipcode: '',
  },
  implementation,
};
