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
      // .replace(/"\s{1,}/g, '"')
      // .replace(/\s{1,}"/g, '"')
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
      if (row.shippingDimensions1) {
        var dimension = row.shippingDimensions1[0].text;
        if (row.shippingDimensions2) {
          dimension = dimension + 'x' + row.shippingDimensions2[0].text;
        }
        if (row.shippingDimensions3) {
          dimension = dimension + 'x' + row.shippingDimensions3[0].text;
        }
        delete row.shippingDimensions1;
      }
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\s*:\s*/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.image) {
        row.image.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.price2) {
        if (!row.price) {
          row.price = [{ text: '$' + row.price2[0].text }];
        }
        delete row.price2;
      }
      if (row.aggregateRating) {
        var scriptJSON = JSON.parse(row.aggregateRating[0].text);
        if (scriptJSON.aggregateRating) {
          row.aggregateRating = [{ text: scriptJSON.aggregateRating.ratingValue }];
          row.ratingCount = [{ text: scriptJSON.aggregateRating.reviewCount }];
        }
      }
      if (row.shippingDimensions2) {
        delete row.shippingDimensions2;
      }
      if (row.shippingDimensions3) {
        delete row.shippingDimensions3;
      }
      if (!row.videos) {
        delete row.videos2;
      } else if (row.videos2) {
        row.videos = [{ text: row.videos2[0].text }];
        delete row.videos2;
      }
      if (row.videos) {
        row.galleryVideos = row.videos;
      }
      if (row.unInterruptedPDP) {
        var arrTemp = [];
        row.unInterruptedPDP.forEach(item => {
          arrTemp.push(item.text);
        });
        if (arrTemp.length) {
          row.unInterruptedPDP = [{ text: arrTemp.join(' || ') }];
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
