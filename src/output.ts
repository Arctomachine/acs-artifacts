import { createObjectCsvWriter } from 'csv-writer'

export function writeArtifactsToFile (artifacts: IArtifact[], pathToFile = './output/artifacts.csv') {
	const parsedArtifacts: {
		material: string
		item?: string
		element: string
		AttackPower: string
		AttackPowerMin: string
		AttackPowerMax: string
		QiRecovery: string
		QiRecoveryMin: string
		QiRecoveryMax: string
		MaxQi: string
		MaxQiMin: string
		MaxQiMax: string
		powerToQi: string
		powerToQiMin: string
		powerToQiMax: string
		recoveryToQi: string
		recoveryToQiMin: string
		recoveryToQiMax: string
		FlyingSpeed: string
		FlyingSpeedMin: string
		FlyingSpeedMax: string
		TurningSpeed: string
		TurningSpeedMin: string
		TurningSpeedMax: string
		Knockback: string
		KnockbackMin: string
		KnockbackMax: string
		KnockbackRes: string
		KnockbackResMin: string
		KnockbackResMax: string
		Volume: string
		VolumeMin: string
		VolumeMax: string
		AttackSpeed: string
		AttackSpeedMin: string
		AttackSpeedMax: string
	}[] = artifacts.map(artifact => {
		return {
			material: artifact.material.name,
			item: artifact.item?.name,
			element: artifact.labels[0].name,

			AttackPower: artifact.stats.AttackPower.toFixed(),
			AttackPowerMin: artifact.statsMin.AttackPower.toFixed(),
			AttackPowerMax: artifact.statsMax.AttackPower.toFixed(),

			QiRecovery: artifact.stats.QiRecovery.toFixed(1),
			QiRecoveryMin: artifact.statsMin.QiRecovery.toFixed(1),
			QiRecoveryMax: artifact.statsMax.QiRecovery.toFixed(1),

			MaxQi: artifact.stats.MaxQi.toFixed(),
			MaxQiMin: artifact.statsMin.MaxQi.toFixed(),
			MaxQiMax: artifact.statsMax.MaxQi.toFixed(),

			powerToQi: artifact.ratios.powerToQi.val.toFixed(3),
			powerToQiMin: artifact.ratios.powerToQi.min.toFixed(3),
			powerToQiMax: artifact.ratios.powerToQi.max.toFixed(3),

			recoveryToQi: artifact.ratios.recoveryToQi.val.toFixed(3),
			recoveryToQiMin: artifact.ratios.recoveryToQi.min.toFixed(3),
			recoveryToQiMax: artifact.ratios.recoveryToQi.max.toFixed(3),

			FlyingSpeed: artifact.stats.FlyingSpeed.toFixed(1),
			FlyingSpeedMin: artifact.statsMin.FlyingSpeed.toFixed(1),
			FlyingSpeedMax: artifact.statsMax.FlyingSpeed.toFixed(1),

			TurningSpeed: artifact.stats.TurningSpeed.toFixed(),
			TurningSpeedMin: artifact.statsMin.TurningSpeed.toFixed(),
			TurningSpeedMax: artifact.statsMax.TurningSpeed.toFixed(),

			Knockback: artifact.stats.Knockback.toFixed(2),
			KnockbackMin: artifact.statsMin.Knockback.toFixed(2),
			KnockbackMax: artifact.statsMax.Knockback.toFixed(2),

			KnockbackRes: artifact.stats.KnockbackRes.toFixed(2),
			KnockbackResMin: artifact.statsMin.KnockbackRes.toFixed(2),
			KnockbackResMax: artifact.statsMax.KnockbackRes.toFixed(2),

			Volume: artifact.stats.Volume.toFixed(2),
			VolumeMin: artifact.statsMin.Volume.toFixed(2),
			VolumeMax: artifact.statsMax.Volume.toFixed(2),

			AttackSpeed: artifact.stats.AttackSpeed.toFixed(1),
			AttackSpeedMin: artifact.statsMin.AttackSpeed.toFixed(1),
			AttackSpeedMax: artifact.statsMax.AttackSpeed.toFixed(1),
		}
	})

	const csvWriter = createObjectCsvWriter({
		path: pathToFile,
		headerIdDelimiter: '.',
		header: [
			{ id: 'material', title: 'Material' },
			{ id: 'item', title: 'Item' },
			{ id: 'element', title: 'Element' },
			{ id: 'AttackPower', title: 'Attack power' },
			{ id: 'AttackPowerMin', title: 'Attack power (min)' },
			{ id: 'AttackPowerMax', title: 'Attack power (max)' },
			{ id: 'QiRecovery', title: 'Qi recovery' },
			{ id: 'QiRecoveryMin', title: 'Qi recovery (min)' },
			{ id: 'QiRecoveryMax', title: 'Qi recovery (max)' },
			{ id: 'MaxQi', title: 'Qi capacity' },
			{ id: 'MaxQiMin', title: 'Qi capacity (min)' },
			{ id: 'MaxQiMax', title: 'Qi capacity (max)' },
			{ id: 'powerToQi', title: 'Power to qi ratio' },
			{ id: 'powerToQiMin', title: 'Power to qi ratio (min)' },
			{ id: 'powerToQiMax', title: 'Power to qi ratio (max)' },
			{ id: 'recoveryToQi', title: 'Recovery to qi ratio' },
			{ id: 'recoveryToQiMin', title: 'Recovery to qi ratio (min)' },
			{ id: 'recoveryToQiMax', title: 'Recovery to qi ratio (max)' },
			{ id: 'FlyingSpeed', title: 'Flying speed' },
			{ id: 'FlyingSpeedMin', title: 'Flying speed (min)' },
			{ id: 'FlyingSpeedMax', title: 'Flying speed (max)' },
			{ id: 'TurningSpeed', title: 'Turning speed' },
			{ id: 'TurningSpeedMin', title: 'Turning speed (min)' },
			{ id: 'TurningSpeedMax', title: 'Turning speed (max)' },
			{ id: 'Knockback', title: 'Knockback' },
			{ id: 'KnockbackMin', title: 'Knockback (min)' },
			{ id: 'KnockbackMax', title: 'Knockback (max)' },
			{ id: 'KnockbackRes', title: 'Knockback res' },
			{ id: 'KnockbackResMin', title: 'Knockback res (min)' },
			{ id: 'KnockbackResMax', title: 'Knockback res (max)' },
			{ id: 'Volume', title: 'Volume' },
			{ id: 'VolumeMin', title: 'Volume (min)' },
			{ id: 'VolumeMax', title: 'Volume (max)' },
			{ id: 'AttackSpeed', title: 'Attack speed' },
			{ id: 'AttackSpeedMin', title: 'Attack speed (min)' },
			{ id: 'AttackSpeedMax', title: 'Attack speed (max)' },
		],
	})

	csvWriter.writeRecords(parsedArtifacts).then(() => {console.log('ready')})
}
