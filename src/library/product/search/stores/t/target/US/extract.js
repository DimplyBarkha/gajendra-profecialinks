
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    console.log("Do pagination");
    let clickNextBtn = () => {
      let nextBtn = document.querySelector('a[data-test="next"]');
      if (nextBtn != null && !nextBtn.hasAttribute("disabled") ) {
          nextBtn.click();
      }
    }

    function stall(ms) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res();
        }, ms)
      })
    }

    let counter = 1;
    var rank = 1;
    while(true) {
      await stall(1000);
      await context.evaluate(async function() {

        function stall(ms) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }

        function addHiddenDiv(el, myClass, content) {
            let newDiv = document.createElement("div");
            newDiv.setAttribute("class", myClass);
            newDiv.textContent = content;
            newDiv.style.display = "none";
            el.appendChild(newDiv);
        }

        function isElementInViewport (el) {
          if(el) {
            let rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
          }
          return false;
        }

        let scrollTop = 0;
        while(!isElementInViewport(document.querySelector('a[data-test="next"]'))) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if(scrollTop == 20000) {
            break;
          }
        }
        
        await stall(1000);
        let itemContainers = document.querySelectorAll('li.Col-favj32-0.bZxgbc.h-padding-a-none');
        let rank = 1;
        for(let itemContainer of itemContainers) {
          addHiddenDiv(itemContainer, 'itemId', itemContainer.querySelector('a').getAttribute('href').split("?")[0].split('/')[4]);
          let pageNum = document.querySelector('button[data-test="select"]') ? document.querySelector('button[data-test="select"]').innerText.split(" ")[1] : 1;
          totalRank = ((pageNum - 1) * 24) + rank;
          addHiddenDiv(itemContainer, 'rank', totalRank);
          let endorsement = itemContainer.querySelector('.AtTargetMessage__AtTargetMessageWrapper-sc-1gv6org-0.liCFqa.h-text-grayDark');
          if(endorsement) {
            addHiddenDiv(itemContainer, 'endorsement', endorsement.innerText.trim());
          }
          rank++;
        }


      });

      await stall(1000);
      return await context.extract(productDetails, { transform });
      await stall(500);
      let hasNextBtn = await context.evaluate(function() {
        let nextBtn = document.querySelector('a[data-test="next"]');
        if (nextBtn && !nextBtn.hasAttribute("disabled") ) {
            return true;
        }
        return false;
      });
      if(!hasNextBtn) {
        break;
      }
      await stall(500);
      await context.evaluate(clickNextBtn);
      if(counter === 7) {
        break;
      }
      counter++;
    }

}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform: null,
    domain: 'target.com',
  },
  implementation,
};
