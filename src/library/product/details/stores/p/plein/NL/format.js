
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
    for (const row of group) {
      // if (row.description) {
      //   const nDesc = [];
      //   let newDesc = '';
      //   let idx = 0;
      //   row.description.forEach(item => {
      //     nDesc[0] = item;
      //     if (idx > 0) {
      //       newDesc = newDesc + '||';
      //     }
      //     newDesc = newDesc + item.text;
      //     idx++;
      //   });
      //   nDesc.forEach(item => {
      //     item.text = newDesc;
      //   });
      //   row.description = nDesc;
      // }
      if (row.specifications) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.specifications.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '||';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.specifications = nDesc;
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = Number(item.text);
          // console.log("row.halfStarCount: ", row.halfStarCount)
          if (row.halfStarCount) {
            // console.log("aggregateRating item.text: ",  item.text);
            item.text = Number(item.text) + Number(row.halfStarCount[0].text / 2);
            item.text = item.text.toString().replace('.', ',');
            // console.log("aggregateRating item.text: ",  item.text);
          }
        });
        row.aggregateRatingText = [{
          text: row.aggregateRating[0].text,
        }];
      }
      if (row.category) {
        const info = [];
        row.category.forEach(item => {
          info.push(item.text.trim());
        });
        if (info.length) {
          row.category = [];
          info.forEach(item => {
            row.category.push({ text: item });
          });
        }
      }
      // if (row.description) {
      //   const text = '';
      //   row.description = [{
      //     text: row.description.reduce((item, currItem) => item ? `${item}  ${currItem.text.replace(/:(\s*\n\s*)+/g, ': ').replace(/(\s*\n\s*)+/, ' || ')}` : currItem.text.replace(/:(\s*\n\s*)/g, ': ').replace(/(\s*\n\s*)+/, ' || '), ''),
      //   }];
      // }
      if (row.description) {
        const description_ar = [];
        row.description.forEach(item => {
          description_ar.push(item.text);
        });
        if (description_ar.length) {
          row.description = [{ text: description_ar.join(' || '), xpath: row.description[0].xpath }];
        }
      }
      // if (row.descriptionBullets) {
      //   row.descriptionBullets = [{'text':row.descriptionBullets.length, 'xpath':row.descriptionBullets[0].xpath}];
      // }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
