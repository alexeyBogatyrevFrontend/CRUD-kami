import { ThunkAction } from 'redux-thunk'
import { RootState } from './index'
import { setLoading, setError, setProducts } from './productsSlice'
import { deleteProductApi, editProductApi, getAllProductsApi } from '../api'
import { message } from 'antd'

type AppThunk = ThunkAction<void, RootState, null, any>

export const fetchProducts = (): AppThunk => async dispatch => {
	try {
		dispatch(setLoading(true))

		const products = await getAllProductsApi()

		dispatch(setProducts(products))
	} catch (error: any) {
		dispatch(setError(error.message))
	}
}

export const deleteProduct =
	(productId: string): AppThunk =>
	async dispatch => {
		try {
			dispatch(setLoading(true))

			await deleteProductApi(productId)

			message.success('Товар удален')

			dispatch(fetchProducts())
		} catch (error: any) {
			dispatch(setError(error.message))
		}
	}

export const editProduct =
	(productId: string, updatedProduct: FormData): AppThunk =>
	async dispatch => {
		try {
			dispatch(setLoading(true))

			await editProductApi(productId, updatedProduct)

			dispatch(fetchProducts())

			message.success('Продукт успешно обновлен')
		} catch (error: any) {
			dispatch(setError(error.message))
		}
	}
