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
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text = item.text.replace(/\s*/g, '');
            item.text = Number(item.text);
          });
        }
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = item.text.replace('(', '');
            item.text = item.text.replace(')', '');
            item.text = Number(item.text);
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
        if (row.quantity) {
          row.quantity.forEach(item => {
            item.text = item.text.match(/\d\d\d+.*/)[0];
          });

        }
        if (row.packSize) {
          row.packSize.forEach(item => {
            item.text = item.text.replace(/\s*/g, '');
            item.text = item.text.replace('Pack', '');
            item.text = item.text.replace('(', '');
            item.text = item.text.replace(')', '');
          });
        }
        if (row.specifications) {
          var specificationArr = [];
          row.specifications.forEach(item => {
            item.text = item.text.replace(/\n\s\n/, ':');
            specificationArr.push(item.text);
          });
          if (specificationArr.length) {
            row.specifications = [{ "text": specificationArr.join(" || ") , 'xpath': row.specifications[0].xpath }];
          } else {
            delete row.specifications;
          }
        }
        if (row.category) {
          let info = [];
          row.category.forEach(item => {
            item.text = item.text.replace("https://www.firstchoiceliquor.com.au/", "").trim(); 
            item.text = item.text.replace(/\/.*/g, "").trim();
            info.push(item.text.trim());
          });
          if (info.length) {
            row.category = [];
            info.forEach(item => {
              row.category.push({ "text": item});
            });
          }
        }
      }
    }
    return cleanUp(data);
  };
module.exports = { transform };