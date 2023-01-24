import { items, materials, objects } from './data.js'
import { makeArtifact } from './artifact.js'
import { writeArtifactsToFile } from './output.js'
import isEqual from 'lodash/isEqual.js'
import fs from 'fs'

const outputDir = './output'
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir)
}

const materialTypes: IType[] = materials
const itemTypes: IType[] = items
const objectTypes: IType[] = objects

const artifactsSimple: IArtifact[] = []
const artifactsCompound: IArtifact[] = []

const artifactsSimpleWiki: IArtifact[] = []
const artifactsCompoundWiki: IArtifact[] = []

objectTypes.forEach((object) => {
	const newArtifact = makeArtifact(object)

	if (newArtifact) {
		const newArtifactWiki = structuredClone(newArtifact)
		newArtifactWiki.material.name = `[[${newArtifactWiki.material.name}]]`

		const twinArtifact = artifactsSimple.find(artifact => compareArtifactLabels(artifact, newArtifact))
		const twinArtifactWiki = artifactsSimpleWiki.find(artifact => compareArtifactLabels(artifact, newArtifactWiki))

		if (twinArtifact) {
			twinArtifact.material.name += `\n${newArtifact.material.name}`
		} else {
			artifactsSimple.push(newArtifact)
		}

		if (twinArtifactWiki) {
			twinArtifactWiki.material.name += `, ${newArtifactWiki.material.name}`
		} else {
			artifactsSimpleWiki.push(newArtifactWiki)
		}
	}
})

materialTypes.forEach((material) => {
	const newArtifact = makeArtifact(material)

	if (newArtifact) {
		const newArtifactWiki = structuredClone(newArtifact)
		newArtifactWiki.material.name = `[[${newArtifactWiki.material.name}]]`

		const twinArtifact = artifactsSimple.find(artifact => compareArtifactLabels(artifact, newArtifact))
		const twinArtifactWiki = artifactsSimpleWiki.find(artifact => compareArtifactLabels(artifact, newArtifactWiki))

		if (twinArtifact) {
			twinArtifact.material.name += `\n${newArtifact.material.name}`
		} else {
			artifactsSimple.push(newArtifact)
		}

		if (twinArtifactWiki) {
			twinArtifactWiki.material.name += `, ${newArtifactWiki.material.name}`
		} else {
			artifactsSimpleWiki.push(newArtifactWiki)
		}
	}
})

materialTypes.forEach((material) => {
	itemTypes.forEach((item) => {
		const newArtifact = makeArtifact(material, item)

		if (newArtifact) {
			const newArtifactWiki = structuredClone(newArtifact)
			newArtifactWiki.material.name = `[[${newArtifactWiki.material.name}]]`

			if (newArtifactWiki.item) {
				newArtifactWiki.item.name = `[[${newArtifactWiki.item.name}]]`
			}

			const twinArtifact = artifactsCompound.find(artifact => compareArtifactLabels(artifact, newArtifact))
			const twinArtifactWiki = artifactsCompoundWiki.find(artifact => compareArtifactLabels(artifact, newArtifactWiki))

			if (twinArtifact && twinArtifact.item && newArtifact.item) {
				twinArtifact.material.name += `\n${newArtifact.material.name}`
				twinArtifact.item.name += `\n${newArtifact.item.name}`
			} else {
				artifactsCompound.push(newArtifact)
			}

			if (twinArtifactWiki && twinArtifactWiki.item && newArtifactWiki.item) {
				twinArtifactWiki.material.name += `, ${newArtifactWiki.material.name}`
				twinArtifactWiki.item.name += `, ${newArtifactWiki.item.name}`
			} else {
				artifactsCompoundWiki.push(newArtifactWiki)
			}

		}
	})
})

const artifactsAll: IArtifact[] = [...artifactsSimple, ...artifactsCompound]
const artifactsAllWiki: IArtifact[] = [...artifactsSimpleWiki, ...artifactsCompoundWiki]

artifactsAll.forEach(artifact => {
	artifact.material.name = removeDuplicatesFromName(artifact.material.name)

	if (artifact.item) {
		artifact.item.name = removeDuplicatesFromName(artifact.item.name)
	}
})
artifactsAllWiki.forEach(artifact => {
	artifact.material.name = removeDuplicatesFromName(artifact.material.name)
	artifact.material.name = replaceLinksInNames(artifact.material.name)

	if (artifact.item) {
		artifact.item.name = removeDuplicatesFromName(artifact.item.name)
	}
})

artifactsAll.sort((a, b) => b.ratios.powerToQi.val - a.ratios.powerToQi.val)
artifactsAllWiki.sort((a, b) => b.ratios.powerToQi.val - a.ratios.powerToQi.val)

writeArtifactsToFile(artifactsAll)
writeArtifactsToFile(artifactsAllWiki, './output/artifacts_with_links.csv')

function compareArtifactLabels (art1: IArtifact, art2: IArtifact) {
	return isEqual(art1.labels, art2.labels)
}

function removeDuplicatesFromName (fullName: string) {
	let name = fullName
	name = [...new Set(name.split('\n'))].join('\n')
	name = [...new Set(name.split(', '))].join(', ')
	return name
}

function replaceLinksInNames (materialFullName: string) {
	let newString = materialFullName

	newString = newString.replace('Spiritwood Timber', 'Spiritwood_(Timber)|Spiritwood Timber')
	newString = newString.replace('Written Talisman (All)', 'Talisman|Written Talisman (All)')
	newString = newString.replace(/([\w\s]+) Offcut/g, 'Offcut|$1 Offcut')
	newString = newString.replace(/([\w\s]+) Hide/g, 'Leather|$1 Hide')
	newString = newString.replace(/([\w\s]+) Fabric/g, 'Cloth|$1 Fabric')
	newString = newString.replace(/Origin \((\w+)\)/g, 'Origins|Origin ($1)')

	return newString
}
