/**
 * @format
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const cleanUp = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.unInterruptedPDP) {
				let text = '';
				row.unInterruptedPDP.forEach((item) => {
					text = row.unInterruptedPDP
						.map((elm) => elm.text)
						.join(' || ')
						.replace(/-/g, '');
				});
				row.unInterruptedPDP = [{ text }];
			}
			if (row.specificationKey && row.specificationValue) {
				let finalText = '';
				for (let i = 0; i < row.specificationKey.length; i++) {
					let breakedText = `|| ${row.specificationKey[i].text} : ${row.specificationValue[i].text}`;
					finalText = finalText + ' ' + breakedText;
				}
				row.specifications = [{ text: finalText.trim() }];
			}
		}
	}

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
				})
			)
		)
	);

	return data;
};

module.exports = { cleanUp };
