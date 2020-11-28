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
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s+\n/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.additionalDescBulletInfo) {
        var arrBullets = [];
        row.additionalDescBulletInfo.forEach(item => {
          arrBullets.push(item.text);
        });
        row.additionalDescBulletInfo = [{ text: '|| ' + arrBullets.join(' || ') }];
      }
      if (row.directions) {
        var arrDire = [];
        row.directions.forEach(item => {
          arrDire.push(item.text);
        });
        row.directions = [{ text: arrDire.join(' ') }];
      }
      if (row.price2) {
        row.price = [{ text: row.price2[0].text }];
        delete row.price2;
      }
      else if (row.price1) {
        row.price = [{ text: row.price1[0].text }];
        delete row.price1;
      }
      if (row.videos1) {
        var arrVideo = [];
        row.videos1.forEach(item => {
          arrVideo.push({ text: item.text });
        });
        row.videos = arrVideo;
        delete row.videos1;
      }
      else if (row.videos2) {
        var arrVideo2 = [];
        row.videos2.forEach(item => {
          arrVideo2.push({ text: item.text });
        });
        row.videos = arrVideo2;
        delete row.videos2;
      }
      if (row.ratingCount) {
        var scriptJSON = JSON.parse(row.ratingCount[0].text);
        if (scriptJSON.aggregateRating) {
          if (scriptJSON.aggregateRating.ratingValue) {
            row.aggregateRating = [{ text: scriptJSON.aggregateRating.ratingValue }];
          }
          if (scriptJSON.aggregateRating.reviewCount) {
            row.ratingCount = [{ text: scriptJSON.aggregateRating.reviewCount }];
          }
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };