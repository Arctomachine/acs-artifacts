interface ITypeRaw {
	Name: string
	Metal: string
	Wood: string
	Water: string
	Fire: string
	Earth: string
	None: string
	Heavy1: string
	Heavy2: string
	Light1: string
	Light2: string
	LowDensity1: string
	LowDensity2: string
	HighDensity1: string
	HighDensity2: string
	Soft1: string
	Soft2: string
	Hard1: string
	Hard2: string
	Smooth1: string
	Smooth2: string
	Rough1: string
	Rough2: string
	Sharp: string
	Blunt: string
	Elastic: string
	Precise: string
	SmallThing: string
	Gravel: string
	Liquid: string
	GreatThing_AttackLow: string
	GreatThing_Attack: string
	GreatThing_Ling: string
	GreatThing_Knock: string
	GreatThing_Rot: string
	GreatThing_Fly: string
}

type LabelName = keyof Omit<ITypeRaw, 'Name'>

interface ILabelRaw {
	Label: LabelName
	MaxQi: string
	QiRecovery: string
	AttackPower: string
	FlyingSpeed: string
	TurningSpeed: string
	Knockback: string
	KnockbackRes: string
	TailLength: string
	Volume: string
	AttackSpeed: string
}

interface IStats {
	MaxQi: number
	QiRecovery: number
	AttackPower: number
	FlyingSpeed: number
	TurningSpeed: number
	Knockback: number
	KnockbackRes: number
	TailLength: number
	Volume: number
	AttackSpeed: number
}

interface ILabel {
	name: LabelName
	stats: IStats
}

interface IType {
	name: string
	labels: ILabel[]
}

interface IArtifact {
	material: IType
	item?: IType
	labels: ILabel[]
	bonuses: IStats
	stats: IStats
	statsMin: IStats
	statsMax: IStats
	ratios: {
		powerToQi: {
			val: number
			min: number
			max: number
		}
		recoveryToQi: {
			val: number
			min: number
			max: number
		}
	}
}
