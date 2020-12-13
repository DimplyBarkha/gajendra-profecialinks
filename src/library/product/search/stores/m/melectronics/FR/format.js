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
  var rank = 1;
  for (const { group } of data) {
    for (const row of group) {
      if (row.id) {
        row.id.forEach(item => {
          var myRegexp = /fr\/p\/(\d+)\//g;
          var match = myRegexp.exec(item.text);
          if (match) {
            item.text = match[1].trim();
          } else {
            delete row.id;
          }
        });
        row.rankOrganic = [{ text: rank }];
        row.rank = [{ text: rank }];
        rank = rank + 1;
      }
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.melectronics.ch'.concat(item.text);
        });
      }
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          var myRegexp = /[Bewertung|Évaluation]:\s*([\d\.]+)/ig;
          item.text = item.text.replace('.', ',').trim();
          var match = myRegexp.exec(item.text);
          if (match) {
            row.aggregateRating2 = [{ text: match[1] }];
          }
        });
      }
      if (row.name && row.brandText) {
        row.name.forEach(item => {
          item.text = row.brandText[0].text.concat(' ', item.text);
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/\.–/g, '').trim();
          item.text = item.text.replace(/\’/g, '').trim();
          item.text = item.text.replace('.', ',').trim();
          item.text = item.text.replace('/\,$/g', '').trim();
        });
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
