const BASE_VALUES: IStats = {
	MaxQi: 260,
	QiRecovery: 60,
	AttackPower: 20,
	FlyingSpeed: 8,
	TurningSpeed: 120,
	Knockback: 0.5,
	KnockbackRes: 0.5,
	TailLength: 5,
	Volume: 1,
	AttackSpeed: 0.5,
}
const BASE_MIN_VALUE = 0.75
const BASE_MAX_VALUE = 1.15
const ITEM_TIER = 12
const ITEM_QUALITY = 100

const defaultStats: IStats = {
	MaxQi: 0,
	QiRecovery: 0,
	AttackPower: 0,
	FlyingSpeed: 0,
	TurningSpeed: 0,
	Knockback: 0,
	KnockbackRes: 0,
	TailLength: 0,
	Volume: 0,
	AttackSpeed: 0,
}

const woods = [
	'Wood',
	'Goldwood',
	'Spiritwood',
	'Phoenixwood',
]

const timbers = [
	'Timber',
	'Goldwood Timber',
	'Parasol Timber',
	'Spiritwood Timber',
]

const stones = [
	'Brownstone',
	'Graystone',
	'Marble',
	'Jade',
	'Spirit Stone',
	'Spirit Crystal',
	'Holy Stone',
	'Stone Essence',
	'Jade Essence',
	'Divine Jade',
]

const blocks = [
	'Brownstone',
	'Graystone',
	'Marble',
	'Jade',
	'Spirit Stone',
	'Holy Stone',
].map(b => `${b} Block`)

const metals = [
	'Iron Ore',
	'Darksteel Ore',
	'Igneocopper Ore',
	'Ice Crystal Ore',
	'Lumina Core',
]

const bars = [
	'Iron',
	'Darksteel',
	'Igneocopper',
	'Ice Crystal',
	'Lumina Core',
	'Ice Essence',
	'Fire Essence',
].map(b => `${b} Bar`)

const fabrics = [
	'Patterned',
	'Indigo',
	'Purple',
	'Yellow',
	'Blue',
	'Red',
	'White',
	'Black',
].map(f => `${f} Fabric`)

const hides = [
	'Boar',
	'Rabbit',
	'Bear',
	'Wolf',
	'Bull',
	'Tiger',
	'Fei',
	'Lushu',
	'Demon',
	'Tough Demon',
].map(h => `${h} Hide`)

const materialsWhiteList = [
	{
		items: [
			'Dice',
			'Bell',
			'Bracelet',
		],
		materials: [
			...timbers,
			...blocks,
			...bars,
			...woods,
			...stones,
			...metals,
		],
	},
	{
		items: [
			'Timber Axe',
			'Pickaxe',
			'Farming Tool',
			'Acupuncture Needle',
			'Sacred Nimbus Plate',
			'Fishing Rod',
			'Vessel',
			'Bow',
			'Blade',
			'Spear',
			'Sword',
			'Mace',
			'Chakram',
			'Fly-Whisk',
			'Sword of Tao',
		],
		materials: [
			...timbers,
			...blocks,
			...bars,
		],
	},
	{
		items: [
			'Umbrella',
			'Handkerchief',
			'Scented Sachet',
		],
		materials: [
			...fabrics,
			...hides,
		],
	},
]

export function makeArtifact (material: IType, item: IType | null = null): IArtifact | null {
	const allLabels = [...material.labels]

	if (item) {
		const allowedCombinations = materialsWhiteList.filter(combination => {
			const itemInList = combination.items.some(i => item.name == i)
			const materialInList = combination.materials.some(m => material.name == m)

			return itemInList && materialInList
		})

		if (!allowedCombinations.length) {
			return null
		}

		if (material.labels[0].name != item.labels[0].name) {
			return null
		}

		item.labels.forEach(label => {
			if (!allLabels.map(l => l.name).includes(label.name)) {
				allLabels.push(label)
			}
		})
	}

	const bonuses = allLabels.map(l => l.stats).reduce((previousValue, currentValue) => {
		const keys = Object.keys(currentValue) as Array<keyof typeof currentValue> | Array<keyof typeof previousValue>
		const newStats = Object.fromEntries(keys.map(key => {
			const a = previousValue[key]
			const b = currentValue[key]

			return [key, a + b]
		})) as unknown as IStats

		return newStats
	}, defaultStats)

	const statKeys = Object.keys(BASE_VALUES) as Array<keyof IStats>

	const statsMin = {} as unknown as IStats
	const statsMax = {} as unknown as IStats
	const stats: IStats = Object.fromEntries(statKeys.map(statKey => {

		statsMin[statKey] = calculateStat(BASE_VALUES[statKey], bonuses[statKey], statKey).min
		statsMax[statKey] = calculateStat(BASE_VALUES[statKey], bonuses[statKey], statKey).max

		return [statKey, calculateStat(BASE_VALUES[statKey], bonuses[statKey], statKey).val]
	})) as unknown as IStats

	const artifact: IArtifact = {
		bonuses: bonuses,
		stats: stats,
		statsMax: statsMax,
		statsMin: statsMin,
		ratios: {
			powerToQi: {
				val: stats.AttackPower / stats.MaxQi,
				min: statsMin.AttackPower / statsMax.MaxQi,
				max: statsMax.AttackPower / statsMin.MaxQi,
			},
			recoveryToQi: {
				val: stats.QiRecovery / stats.MaxQi,
				min: statsMin.QiRecovery / statsMax.MaxQi,
				max: statsMax.QiRecovery / statsMin.MaxQi,
			},
		},
		material: structuredClone(material),
		labels: allLabels,
	}

	if (item) {
		artifact.item = structuredClone(item)
	}

	return artifact
}

function calculateStat (base: number, bonus: number, type?: keyof IStats) {
	const num = 0.5 + 0.15 * ITEM_TIER + (ITEM_TIER >= 12 ? 0.75 : 0)
	const num2 = 0.5 + (ITEM_QUALITY / 100) * 0.5
	const num3 = ITEM_QUALITY >= 90 ? 1.2 : 1
	let num4, num4min, num4max: number
	let value, valueMin, valueMax: number

	if (type == 'Knockback' || type == 'KnockbackRes' || type == 'AttackSpeed') {
		num4 = base + bonus
	} else {
		num4 = base * (1 + bonus)
	}

	num4min = num4 * BASE_MIN_VALUE
	num4max = num4 * BASE_MAX_VALUE

	let compareTo: number
	switch (type) {
		case 'TurningSpeed': {
			compareTo = 80
			value = Math.max(num4, compareTo)
			valueMin = Math.max(num4min, compareTo)
			valueMax = Math.max(num4max, compareTo)
			break
		}

		case 'Volume': {
			compareTo = 0.4
			value = Math.max(num4, compareTo)
			valueMin = Math.max(num4min, compareTo)
			valueMax = Math.max(num4max, compareTo)
			break
		}

		case 'AttackSpeed': {
			compareTo = 0.2
			value = Math.max(num4, compareTo)
			valueMin = Math.max(num4min, compareTo)
			valueMax = Math.max(num4max, compareTo)
			break
		}

		case 'AttackPower': {
			compareTo = 0.4
			value = Math.max(num4 * Math.max(num * num2 * num3, compareTo), 1)
			valueMin = Math.max(num4min * Math.max(num * num2 * num3, compareTo), 1)
			valueMax = Math.max(num4max * Math.max(num * num2 * num3, compareTo), 1)
			break
		}

		default: {
			compareTo = 0.4
			value = num4 * Math.max(num * num2 * num3, compareTo)
			valueMin = num4min * Math.max(num * num2 * num3, compareTo)
			valueMax = num4max * Math.max(num * num2 * num3, compareTo)
			break
		}
	}

	return {
		val: value,
		min: valueMin,
		max: valueMax,
	}
}
