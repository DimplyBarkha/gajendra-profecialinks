
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  // if (await context.evaluate(()=>{document.querySelector('div[class="col JOpGWq _33R3aa"] >a') || document.querySelector('div[class="col JOpGWq"] > a')}))
  // {
  await context.evaluate(async function () {
    // clicking on reviews button
    const reviews_button = document.querySelector('div[class="col JOpGWq _33R3aa"] >a') || document.querySelector('div[class="col JOpGWq"] > a');
    if (reviews_button) {
      console.log('clicking on feed');
      reviews_button.click();
      await new Promise(r => setTimeout(r, 2000));

      var a = window.location.href;
      var most_recent = a.match(/(.+)(&)/);
      var final_most_recent = most_recent[1];

      var most_recent_url = final_most_recent.concat('&sortOrder=MOST_RECENT');
      console.log(most_recent_url);
      if (!final_most_recent.includes('&sortOrder=MOST_RECENT')) {
        window.location = most_recent_url;
      // await new Promise(r => setTimeout(r, 2000));
      }
    }
  });
  // if (await context.evaluate(()=>{document.querySelector('select > option[selected][value="MOST_RECENT"]')})){
  // (async() => {

  //   try {
  //      context.waitForSelector('select > option[selected][value="MOST_RECENT"]');
  //   } catch(error) {
  //     // do as you wish with this error and then do your next actions
  //     console.log('Reviews are not present on website so it is not done Most_Recent value');
  //   }
  // })
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
      if (days[0] == 'Today' && days[0] != undefined) {
        var d = new Date();
        d.setDate(d.getDate());
        date2 = date2.replace(date2, d.toString());
      }

      if (days[1] == 'days' || days[1] == 'day' && days[0] != undefined) {
        var d = new Date();
        d.setDate(d.getDate() - parseInt(days[0]));
        date2 = date2.replace(date2, d.toString());
      }

      if (days[1] == 'months' || days[1] == 'month' && days[0] != undefined) {
        var d = new Date();
        d.setMonth(d.getMonth() - parseInt(days[0]));
        date2 = date2.replace(date2, d.toString());
      }
      function getMonthFromString (mon) {
        var d = Date.parse(mon + '1, 2012');
        if (!isNaN(d)) {
          return new Date(d).getMonth() + 1;
        }
        return -1;
      }
      function toDate (dateStr) {
        var parts = dateStr.split('-');
        return new Date(parts[2], parts[1] - 1, parts[0]);
      }
      if (days[0] != 'Today' && days[0] != undefined && days.length <= 2) {
        var s1 = new Date();
        var s2 = s1.getDate();
        var g1 = getMonthFromString(days[0]);
        var date3 = toDate(s2 + '-' + g1 + '-' + days[1]);
        date2 = date2.replace(date2, date3.toString());
      }
      console.log(date2);

      // console.log('DATE STRING', d.toString());
      return date2;
    // return d.toString();
    }

    // Review Text
    var review_text = document.querySelectorAll('div[class="t-ZTKy"] > div > div');
    var date = document.querySelectorAll('p[class="_2sc7ZR"]');
    var helpful = document.querySelectorAll('div[class="_1LmwT9"] > span[class="_3c3Px5"]');
    var review_title = document.querySelectorAll('p[class="_2-N8zT"]');
    var user = document.querySelectorAll('p[class="_2sc7ZR _2V5EHH"]');
    // var review_rating = getElementByXpath('//div[contains(@class,"_3LWZlK ")] ');
    var review_rating = document.querySelectorAll('div[class="_3LWZlK _1BLPMq"]');
    // var verified_purchase = getElementByXpath('//span[contains(text(),"Certified Buyer")]');
    var container = document.querySelectorAll('div._27M-vq');

    // console.log('-----', review_text);
    if (container) {
      for (var i = 0; i < container.length; i++) {
        var searchUrl = window.location.href;
        addHiddenDiv(container[i], 'review_url', searchUrl);
        // SKU Code
        const regx = /(pid=([0-9a-zA-Z]+))/g;
        const match = regx.exec(searchUrl);
        // console.log(match[2])
        addHiddenDiv(container[i], 'variantId', match[2]);
        // Product URL
        const product_url = searchUrl.replace(/product-reviews/g, 'p').replace(/&lid(.+)/g, '');
        console.log(product_url);
        addHiddenDiv(container[i], 'product_url', product_url);

        // date time
        // if(!searchUrl.includes('page='))
        {
          console.log('Page=1');
          console.log(product_url);
          if (date[i]) {
            // console.log('-------date--type--------',date[i].textContent);
            await new Promise(r => setTimeout(r, 2000));
            const date_time = timeSince(date[i].textContent);
            if (date_time) {
              addHiddenDiv(container[i], 'date_time', date_time);
            }
          }
        }
        // product name
        const product_name = getElementByXpath('//a[contains(@class,"_2rpwqI")]/@title');
        if (product_name) {
          addHiddenDiv(container[i], 'product_name', product_name.textContent);
        }
        // aggregateRating2
        const aggregateRating2 = getElementByXpath('//div[@class="_2d4LTz"]');
        if (aggregateRating2) {
          addHiddenDiv(container[i], 'aggregateRating2', aggregateRating2.textContent);
        }
        // helpful count

        // const helpful_count = getElementByXpath('//div[@class="_1LmwT9"]//span[@class="_3c3Px5"]');
        if (helpful[i]) {
          addHiddenDiv(container[i], 'helpful_count', helpful[i].textContent);
        }
        // Review Rating

        if (review_rating[i]) {
          addHiddenDiv(container[i], 'review_rating', review_rating[i].textContent);
        }
        // Review Title

        if (review_title[i]) {
          addHiddenDiv(container[i], 'review_title', review_title[i].textContent);
        }
        // Verified Purchase

        var verified_purchase = getElementByXpath('//span[contains(text(),"Certified Buyer")]');
        if (verified_purchase) {
          addHiddenDiv(container[i], 'verified_purchase', verified_purchase.textContent);
        }
        // User

        if (user[i]) {
          addHiddenDiv(container[i], 'user', user[i].textContent);
        }

        // Review Text
        // var review_text = getElementByXpath('//div[@class="t-ZTKy"]/div/div');
        if (review_text[i]) {
          addHiddenDiv(container[i], 'review_text', review_text[i].textContent);
        }

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
      }
    }
  });
  // }

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
