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
      for (let row of group) {
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text =  Number(item.text);
          });
        }
        if (row.aggregateRating) {
            row.aggregateRating.forEach(item => {
              item.text =  Number(item.text);
            });
        }
        if (row.description) {
            let description_ar = [];
            row.description.forEach(item => {
              description_ar.push(item.text);
            });
            if (description_ar.length) {
              row.description = [{ "text": description_ar.join(" || "), 'xpath': row.description[0].xpath }];
            }
        }
        if(row.availabilityText){
          row.availabilityText.forEach(item => {
            if (item.text == 'Unavailable'){
              row.availabilityText = [{"text": 'Out of Stock', "xpath": row.availabilityText[0].xpath}]
            }else{
              row.availabilityText = [{"text": 'In Stock', "xpath": row.availabilityText[0].xpath}]
            }
          })
        }
        if (row.specifications) {
          let spec_ar = [];
          row.specifications.forEach(item => {
            spec_ar.push(item.text);
          });
          if (spec_ar.length) {
            row.specifications = [{ "text": spec_ar.join(" || "), 'xpath': row.specifications[0].xpath }];
          }
        }
        if (row.price) {
            row.price.forEach(item => {
              item.text = item.text.replace(/\B(?=(\d{2})+(?!\d))/g, ".").trim();
            });
        }
      }
    }
    return cleanUp(data);
  };
module.exports = { transform };