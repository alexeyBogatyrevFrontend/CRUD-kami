import { Router } from 'express'
import multer from 'multer'
import { readdirSync } from 'fs'
import path from 'path'

const router = Router()
const upload = multer({ dest: 'uploads/' })

let products: any[] = []

// get all products
router.get('/', (req, res) => {
	res.json(products)
})

// create a product
router.post('/', upload.array('images'), (req, res) => {
	const { id, title, description, status, price } = req.body
	const images = req.files

	if (!title || !images || !images.length || !price) {
		return res
			.status(400)
			.json({ message: 'Пожалуйста, заполните все обязательные поля.' })
	}

	const imagePaths = (images as Express.Multer.File[]).map(
		(file: any) => file.path
	)

	const newProduct = {
		id,
		title,
		description,
		images: imagePaths,
		status,
		price,
	}

	products.push(newProduct)
	res.status(201).json(newProduct)
})

// update a product
router.put('/:id', upload.array('images'), (req, res) => {
	const { id } = req.params
	const { title, description, status, price } = req.body
	const removedImages = JSON.parse(req.body.removedImages || '[]')
	const images = req.files

	const productIndex = products.findIndex(p => p.id === id)

	if (productIndex === -1) {
		return res.status(404).json({ message: 'Продукт не найден' })
	}

	const currentProduct = products[productIndex]

	let allImages = currentProduct.images.slice()

	if (images) {
		const newImagePaths = (images as Express.Multer.File[]).map(
			(file: any) => file.path
		)
		allImages = [...allImages, ...newImagePaths]
	}

	const updatedImages = allImages.filter(
		(img: string) => !removedImages.includes(img)
	)

	const updatedProduct = {
		id,
		title,
		description,
		images: updatedImages,
		status,
		price,
	}

	products[productIndex] = updatedProduct

	res.json(updatedProduct)
})

// Delete a product
router.delete('/:id', (req, res) => {
	const { id } = req.params

	products = products.filter(p => p.id !== id)
	res.status(204).end()
})

export default router
