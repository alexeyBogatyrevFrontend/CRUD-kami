import axios from 'axios'

const API_URL = 'http://localhost:5001'

export const getAllProductsApi = async () => {
	try {
		const response = await axios.get(`${API_URL}/products`)

		return response.data
	} catch (error: any) {
		throw new Error(`Ошибка при загрузке продуктов: ${error.message}`)
	}
}

export const createProductApi = async (productData: FormData) => {
	try {
		const response = await axios.post(`${API_URL}/products`, productData)

		return response.data
	} catch (error) {
		throw new Error('Ошибка при создании продукта')
	}
}

export const deleteProductApi = async (productId: string) => {
	try {
		await axios.delete(`${API_URL}/products/${productId}`)
	} catch (error) {
		throw new Error('Ошибка при удалениее продукта')
	}
}

export const editProductApi = async (
	productId: string,
	updatedProduct: FormData
) => {
	try {
		const response = await axios.put(
			`${API_URL}/products/${productId}`,
			updatedProduct
		)

		return response.data
	} catch (error) {
		throw new Error('Ошибка при обновлении продукта')
	}
}
