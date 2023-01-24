import fs from 'fs'
// @ts-ignore
import parser from 'csv-parser'

const [
	labelsData,
	materialsData,
	itemsData,
	objectsData,
] = await Promise.all([
	readCsvFile('./data/labels.csv').then(res => res),
	readCsvFile('./data/is material.csv').then(res => res),
	readCsvFile('./data/has material.csv').then(res => res),
	readCsvFile('./data/has no material.csv').then(res => res),
]) as [
	ILabelRaw[],
	ITypeRaw[],
	ITypeRaw[],
	ITypeRaw[],
]

const labels: ILabel[] = labelsData.map((label) => {
	const keys = Object.keys(label) as Array<keyof typeof label>
	const stats = Object.fromEntries(keys.filter(key => key !== 'Label').map(key => {
		const value = label[key].length ? label[key] : 0
		const statValue = Number(value) // parseFloat(label[key])
		return [key, statValue]
	})) as unknown as IStats

	return {
		name: label.Label,
		stats: stats,
	}
})

const possibleElementalLabels = [
	'Wood',
	'Earth',
	'Fire',
	'Water',
	'Metal',
	'None',
]

/*
	Exports
 */

export const materials: IType[] = makeType(materialsData)
export const items: IType[] = makeType(itemsData)
export const objects: IType[] = makeType(objectsData)

export {
	labels,
	possibleElementalLabels,
}

/*
	Helper functions ahead
 */

async function readCsvFile (path: string) {
	const result: any = []

	return new Promise(resolve => {
		fs.createReadStream(path)
			.pipe(parser())
			.on('data', (data: any) => {
				result.push(data)
			})
			.on('end', () => {
				resolve(result)
			})
	})
}

function makeType (rawData: ITypeRaw[]): IType[] {
	const newData = rawData.map(rawItem => {
		const { Name, ...rawItemLabels } = rawItem
		const labelNames = Object.keys(rawItemLabels) as Array<keyof typeof rawItemLabels>
		const newLabels = labelNames.filter(l => rawItem[l]).map(labelName => {
			const label: ILabel | undefined = labels.find(l => l.name === labelName)

			if (label) {
				return label
			}
		}) as IType['labels']

		return {
			name: Name,
			labels: newLabels,
		}
	})

	return splitMultipleElementalLabels(newData)
}

function splitMultipleElementalLabels (items: IType[]) {
	return items.flatMap(item => {
		const hasElementalLabels = item.labels.filter(l => possibleElementalLabels.includes(l.name))
		const nonElementalLabels = item.labels.filter(l => !possibleElementalLabels.includes(l.name))

		return hasElementalLabels.map(elementalLabel => {
			const newItem: IType = {
				name: item.name,
				labels: [
					elementalLabel,
					...nonElementalLabels,
				],
			}

			return newItem
		})
	})
}
