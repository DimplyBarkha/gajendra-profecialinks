/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };

  for (const { group } of data) {
    console.log("hi format")
    for (let row of group) {

      if (row.sku) {
        row.sku.forEach(item => {
          let data = JSON.parse(item.text);
          if (data['sku']) {
            if (data['sku']) {
              item.text = data['sku'];
            }
          } else {
            item.text = "";
          }
        });
      }

      if (row.variantId) {
        row.variantId.forEach(item => {
          let data = JSON.parse(item.text);
          if (data['sku']) {
            if (data['sku']) {
              item.text = data['sku'];
            }
          } else {
            item.text = "";
          }
        });
      }
      // if (row.variantId) {
      //     let variId = [];
      //     row.variantId.forEach(item => {
      //         variId =  /[^/]*$/.exec(item.text)[0].split(".");
      //         item.text = "" + variId[0];
      //     });
      // }
     if (row.description) {
        let info = [];
        row.description.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' || ').trim());
        });
        row.description = [{ 'text': info.join(' || '), 'xpath': row.description[0].xpath }];
      }
      if (row.warnings) {
        let info = [];
        row.warnings.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
        });
        row.warnings = [{ 'text': info.join(' | '), 'xpath': row.warnings[0].xpath }];
      }
      if (row.directions) {
        let info = [];
        row.directions.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
        });
        row.directions = [{ 'text': info.join(' | '), 'xpath': row.directions[0].xpath }];
      }
      if (row.ingredientsList) {
        let info = [];
        row.ingredientsList.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
        });
        row.ingredientsList = [{ 'text': info.join(' | '), 'xpath': row.ingredientsList[0].xpath }];
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          let data = JSON.parse(item.text);
          if (data['aggregateRating']) {
            if (data['aggregateRating']['ratingValue']) {
              item.text = '' + parseFloat(data['aggregateRating']['ratingValue']).toFixed(1);
            }
          } else {
            item.text = "";
          }
        });
      }

      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          let data = JSON.parse(item.text);
          if (data['aggregateRating']) {
            if (data['aggregateRating']['ratingCount']) {
              item.text = data['aggregateRating']['ratingCount'];
            }
          } else {
            item.text = "";
          }
        });
      }
      if (row.gtin) {
        row.gtin.forEach(item => {
          let data = JSON.parse(item.text);
          if (data['gtin13']) {
            if (data['gtin13']) {
              item.text = data['gtin13'];
            }
          } else {
            item.text = "";
          }
        });
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          let data = JSON.parse(item.text);
          if (data['brand']) {
            if (data['brand']['name']) {
              item.text = data['brand']['name'];
            }
          } else {
            item.text = "";
          }
        });
      }
      if (row.price) {
        let info = [];
        row.price.forEach(item => {
          info.push(item.text);
        });
        row.price = [{ 'text': info.join(''), 'xpath': row.price[0].xpath }];
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          console.log("check", item.text);
          if (item.text == 'true') {
            item.text = "In Stock";
          } else {
            item.text = "Out of Stock";
          }
        });
      }

      if (row.quantity) {
        row.quantity.forEach(item => {
          const quantity1 = item.text.split(" ");
          item.text = quantity1[quantity1.length - 1];
        });
      }

      // if (row.sodiumPerServing) {
      //   row.sodiumPerServing.forEach(item => {
      //     if (item.text.includes("mg")) {
      //       let split = item.text.split("mg");
      //       item.text = `${split[0]}`;
      //     }
      //   });

      // }
      // if (row.saturatedFatPerServing) {
      //   row.saturatedFatPerServing.forEach(item => {
      //     if (item.text.includes("g")) {
      //       let split = item.text.split("g");
      //       item.text = `${split[0]}`;
      //     }
      //   });

      // }

      if (row.promotion) {
        let text = [];
        let join = '';
        row.promotion.forEach(item => {
          text.push(item.text);
        });
        text.reverse();
        for (let index = 0; index < text.length; index++) {
          join += text[index].trim() + ' ';
          console.log("join",join);

        }
        join = join.slice(0,-1);
        row.promotion = [
          {
            text: join,
          },
        ];
      }

      if (row.listPrice) {
        row.listPrice.forEach(item => {
          let data = JSON.parse(item.text);
          console.log("data",data);
          if (data['offers']) {
            if (data['offers']['price']) {
              item.text = data['offers']['price'];
            }
          } else {
            item.text = "";
          }
        });
      }
      // if (row.proteinPerServing) {
      //   row.proteinPerServing.forEach(item => {
      //     if (item.text.includes("g")) {
      //       let split = item.text.split("g");
      //       item.text = `${split[0]}`;
      //     }
      //   });
      // }

      // if (row.totalCarbperServing) {
      //   row.totalCarbperServing.forEach(item => {
      //     if (item.text.includes("g")) {
      //       let split = item.text.split("g");
      //       item.text = `${split[0]}`;
      //     }
      //   });
      // }

    }
  }
  return cleanUp(data);
};

module.exports = { transform };