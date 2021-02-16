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
            description_ar.push(item.text);
          });
          if (description_ar.length) {
            row.description = [{ "text": description_ar.join(" | ").replace('SWEET MAG', '').trim(), 'xpath': row.description[0].xpath }];
          }
      }
      if (row.directions) {
        let info = [];
        row.directions.forEach(item => {
          info.push(item.text);
        });
        if (info.length) {
          row.directions = [{ "text": info.join(" "), 'xpath': row.directions[0].xpath }];
        }
    }
    if (row.image) {
      let info = [];
      row.image.forEach(item => {
        info.push(item.text);
      });
      if (info.length) {
        row.image = [{ "text": info[0], 'xpath': row.image[0].xpath }];
      }
  }  
  if (row.promotion) {
    let info = [];
    row.promotion.forEach(item => {
      item.text = item.text.match(/poupe até.*/);
      info.push(item.text);
  });
  if (info.length) {
    row.promotion = [{ "text": '-'+info.join().replace('poupe até','').replace(' | Sweetcare®','').replace(/\s*/g,''), 'xpath': row.promotion[0].xpath }];
  }
}
   if (row.price) {
      let info = [];
      row.price.forEach(item => {
        item.text = item.text.replace(/\s*/g, '').trim();
        item.text = item.text.slice(1,-1);
        item.text = '€'+item.text;
        item.text = item.text.replace('.', ',').trim();
        info.push(item.text);
    });
    if (info.length) {
      row.price = [{ "text": info[0], 'xpath': row.price[0].xpath }];
    }
}
  if (row.imageAlt) {
    let info = [];
    row.imageAlt.forEach(item => {
      info.push(item.text);
    });
    if (info.length) {
      row.imageAlt = [{ "text": info[0], 'xpath': row.imageAlt[0].xpath }];
    }
}
      if (row.descriptionBullets) {
        row.descriptionBullets = [{'text':row.descriptionBullets.length, 'xpath':row.descriptionBullets[0].xpath}];              
      } 
      if (row.category) {
        let info = [];
        row.category.forEach(item => {
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