const {transform} = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'ButteCounty',
    transform,
    domain: 'cabutteodyprod.tylerhost.net',
    zipcode: "''",
  },
  implementation
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.select('select#cboHSSearchBy','JudicialOfficer');
  await context.select('select#selHSJudicialOfficer','9252');
  await context.setInputValue('input#SearchCriteria_DateFrom','01/01/2019');
  await context.setInputValue('input#SearchCriteria_DateTo','12/31/2020');
  await context.click('input#btnHSSubmit');
  await context.waitForSelector('div#hearingSearchResults');
  await new Promise((resolve, reject) => setTimeout(resolve, 20000)); 
  const detailsurls = await context.evaluate(async function () {
    let cnumber = document.querySelectorAll('a[data-caseid]');
    const detailsurls =[];
    for(let caseno of cnumber ){
    let caseid= caseno.getAttribute('data-casenumber')
    let locid= caseno.getAttribute('data-locationid')
    let eid= caseno.getAttribute('data-caseid')
    let detailsurl=`https://cabutteodyprod.tylerhost.net/Portal/Case/CaseDetail?eid=${eid}&CaseNumber=${caseid}&LocationId=${locid}`
        detailsurls.push(detailsurl);
      } 
      return detailsurls;
  }) 
  console.log('urls',detailsurls);
  await context.goto(detailsurls[0]);
  return await context.extract(productDetails, { transform });
}