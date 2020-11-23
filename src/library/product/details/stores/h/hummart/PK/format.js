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
        if (row.description) {
            let description_ar = [];
            row.description.forEach(item => {
              item.text = item.text.replace("#", '||').trim();
              item.text = item.text.replace(", ", '||').trim();
              item.text = item.text.replace(". ", '||').trim();
              description_ar.push(item.text);
            });
            if (description_ar.length) {
              row.description = [{ "text": description_ar.join(" || "), 'xpath': row.description[0].xpath }];
            }
        }
        if (row.specifications) {
          let specifications_ar = [];
          row.specifications.forEach(item => {
            specifications_ar.push(item.text);
          });
          if (specifications_ar.length) {
            row.specifications = [{ "text": specifications_ar.join(" || "), 'xpath': row.specifications[0].xpath }];
          }
        }
        if (row.descriptionBullets) {
          row.descriptionBullets = [{'text':row.descriptionBullets.length, 'xpath':row.descriptionBullets[0].xpath}];              
        } 
        if (row.category) {
          let info = [];
          row.category.forEach(item => {
            item.text = item.text.replace(/\s*/g, '').trim();
            item.text = item.text.replace("DefaultCategory/Octwenty20Discounts/", '');
            item.text = 'c'+item.text;
            item.text = item.text.slice(1,-1);
            info.push({ "text": item.text});
          });
        }
      }
    }
    return cleanUp(data);
  };
module.exports = { transform };