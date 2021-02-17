
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;

  await context.evaluate(async function () {
    // clicking on reviews button
    const reviews_button = document.querySelector('div[class="col JOpGWq _33R3aa"] >a') || document.querySelector('div[class="col JOpGWq"] > a');
    if (reviews_button) {
      console.log('clicking on feed');
      reviews_button.click();
    }

    var a = window.location.href;
    var most_recent = a.match(/(.+)(&)/);
    var final_most_recent = most_recent[1];

    var most_recent_url = final_most_recent.concat('&sortOrder=MOST_RECENT');
    console.log(most_recent_url);
    if (!final_most_recent.includes('&sortOrder=MOST_RECENT')) {
      window.location = most_recent_url;
    }
  });

  await context.waitForSelector('select > option[selected][value="MOST_RECENT"]');
  console.log('Page has been changed....');

  await context.evaluate(async function () {
    function addHiddenDiv (el, myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }
    function getElementByXpath (path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    //  Date
    function timeSince (date2) {
      var now = new Date();
      console.log('-------', date2);
      console.log('--------', typeof (date2));

      var days = date2.match(/\w+/g);
      console.log('----', days);
      if (days[0] == 'Today') {
        var d = new Date();
        d.setDate(d.getDate());
        date2 = date2.replace(date2, d.toString());
      }
      if (days[1] == 'days' || days[1] == 'day') {
        var d = new Date();
        d.setDate(d.getDate() - parseInt(days[0]));
        // console.log(d.toString());
        date2 = date2.replace(date2, d.toString());
      }
      // if(days[1] == 'months')
      // {
      //   var d = new Date();
      //   d.setMonth(d.getMonth() - parseInt(days[0]));
      //   console.log(d.toString());
      //   date2 = date2.replace(date2, d.toString());
      // }
      return date2;
    }

    // Pagination
    // var count = document.querySelectorAll('nav.yFHi8N > a').length - 2;
    // console.log(count);

    // Review Text
    const review_text = document.querySelectorAll('div[class="t-ZTKy"] > div > div');
    const date = document.querySelectorAll('p[class="_2sc7ZR"]');
    console.log('-----', review_text);
    if (review_text) {
      for (var i = 0; i < review_text.length; i++) {
        console.log(review_text[i].textContent);
        addHiddenDiv(review_text[i], 'review_text', review_text[i].textContent);
        const searchUrl = window.location.href;
        addHiddenDiv(review_text[i], 'review_url', searchUrl);
        // SKU Code
        const regx = /(pid=([0-9a-zA-Z]+))/g;
        const match = regx.exec(searchUrl);
        // console.log(match[2])
        addHiddenDiv(review_text[i], 'variantId', match[2]);
        // Product URL
        const product_url = searchUrl.replace(/product-reviews/g, 'p').replace(/&lid(.+)/g, '');
        console.log(product_url);
        addHiddenDiv(review_text[i], 'product_url', product_url);
        // product brand starts with first name
        // const getname = document.querySelector('a._2rpwqI');
        // if (getname){
        // var brand = getname.getAttribute('title').split(" ")[0];
        // addHiddenDiv(review_text[i],'brandText',brand);
        // }
        // if(brand_review)
        // {
        // addHiddenDiv(review_text[i],'brandText',brand_review);
        // }
        if (date[i]) {
        // console.log('-------date--type--------',date[i].textContent);
          const date_time = timeSince(date[i].textContent);
          if (date_time) {
            addHiddenDiv(review_text[i], 'date_time', date_time);
          }
        }
      }
    }
  });

  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    transform: transform,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation,
};
