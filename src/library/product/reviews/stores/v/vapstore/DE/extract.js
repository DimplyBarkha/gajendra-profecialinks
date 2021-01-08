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
    for (const { group } of data) {
      for (const row of group) {
        if (row.mediaURL) {
          const url = row.mediaURL[0].text;
          row.mediaURL[0].text = 'https://www.vapstore.de/' + url;
        }
        if (row.aggregateRating) {
          let aggregateRating = row.aggregateRating[0].text;
          aggregateRating = aggregateRating.replace('Durchschnittliche Artikelbewertung: ', '');
          aggregateRating = aggregateRating.replace('/5', '');
          row.aggregateRating[0].text = aggregateRating;
        }
      }
    }

    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));

    return data;
  };
  return cleanUp(data);
};

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'vapstore',
    transform,
    domain: 'vapstore.de',
    zipcode: "''",
  },

};
