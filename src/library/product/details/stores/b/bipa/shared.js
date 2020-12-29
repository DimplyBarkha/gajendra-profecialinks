/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const transform = (data) => {
  // Default transform function
  const clean = (text) =>
    text
      .toString()
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
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  const arrayOfFieldsToConcat = [
    'description',
    'specifications',
    'manufacturerDescription',
    'additionalDescBulletInfo',
  ];
  const concatFunction = (item, index, length) => {
    let text = '';
    if (index + 1 < length) {
      text += `${item.text} || `;
    } else {
      text += `${item.text}`;
    }

    return text;
  };
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) => {
        // run concat function for fields specified in arrayOfFieldsToConcat array
        if (arrayOfFieldsToConcat.includes(header)) {
          let text = '';
          row[header].forEach(
            (el, i, arr) => (text += concatFunction(el, i, arr.length)),
          );
          row[header] = [
            {
              text: text,
            },
          ];
        }
      }),
    ),
  );

  return data;
};

module.exports = { transform };
