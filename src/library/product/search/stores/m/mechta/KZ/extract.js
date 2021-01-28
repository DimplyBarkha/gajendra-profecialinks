const { transform } = require("./format");

module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "KZ",
    store: "mechta",
    transform,
    domain: "mechta.kz",
    zipcode: "''",
  },
  implementation: async (
    { url },
    { country, domain, transform },
    context,
    { productDetails }
  ) => {
    await context.evaluate(async () => {
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      let scrollTop = 0;
      while (scrollTop !== 5000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 5000) {
          await stall(500);
          break;
        }
      }

      let index = 1;
      while (index < 10) {
        console.log("index:: ", index);

        let nextScrollTop = 2000;
        let moreButton;
        try {
          moreButton = document.evaluate(
            '//button[contains(@class, "q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-primary")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        } catch (err) {
          console.log("Error occurred for moreButton : ", err);
        }
        if (moreButton && moreButton.singleNodeValue != null) {
          // console.log("clicking more button for index:: ", index);
          try {
            moreButton.singleNodeValue.click();
            // }catch(e) {}
            // await new Promise((resolve, reject) => setTimeout(resolve, 500));
            let scrollTop = 0;
            let maxScroll = nextScrollTop * index;
            while (scrollTop !== maxScroll) {
              await stall(500);
              scrollTop += 1000;
              // console.log("scrollTop:: ", scrollTop);
              // console.log("nextScrollTop * index:: ", maxScroll);
              window.scroll(0, scrollTop);
              if (scrollTop === maxScroll) {
                await stall(500);
                // console.log("calling  break");
                break;
              }
            }
            index++;
          } catch (e) {}
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        } else {
          index++;
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
