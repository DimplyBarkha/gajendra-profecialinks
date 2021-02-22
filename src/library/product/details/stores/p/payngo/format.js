/**
 * @format
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const transform = (data) => {
	const cleanUp = (text) =>
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

	for (const { group } of data) {
		for (const row of group) {
			if (row.description) {
				row.description[0].text = row.description[0].text.replace(
					/(\n){1,}/g,
					' || '
				);
				if (row.description[1]) {
					row.description[0].text =
						cleanUp(row.description[0].text) +
						'. ' +
						cleanUp(row.description[1].text);
					row.description.pop();
				}
			}

			if (row.specifications) {
				row.specifications[0].text = row.specifications[0].text.replace(
					/(:\n\s){1,}/g,
					':'
				);
			}
			if (row.specifications) {
				let text = row.specifications
					.map((specification) => specification.text.trim())
					.join('||')
					.replace(/\r\n|\r|\n/g, ' ');
				row.specifications = [{ text }];
			}

			if (row.additionalDescBulletInfo) {
				row.additionalDescBulletInfo[0].text =
					'|| ' + row.additionalDescBulletInfo[0].text;
			}

			if (row.brandText && row.name) {
				if (row.brandText[0].text !== row.name[0].text.split(' ')[0]) {
					row.nameExtended = [
						{ text: row.brandText[0].text + ' - ' + row.name[0].text },
					];
				}
			}

			if (!row.brandText) {
				row.brandText = [{ text: row.name[0].text.split(' ')[0] }];
			}

			if (row.warranty) {
				row.warranty = [{ text: cleanUp(row.warranty[0].text) }];
			}
		}
	}
	data.forEach((obj) =>
		obj.group.forEach((row) =>
			Object.keys(row).forEach((header) =>
				row[header].forEach((el) => {
					el.text = cleanUp(el.text);
				})
			)
		)
	);
	return data;
};
module.exports = { transform };
