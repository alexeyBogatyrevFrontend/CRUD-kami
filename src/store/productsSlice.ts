import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductType } from '../../types'
import { RootState } from './index'

interface ProductsState {
	products: ProductType[]
	loading: boolean
	error: string | null
}

const initialState: ProductsState = {
	products: [],
	loading: false,
	error: null,
}

const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		setProducts(state, action: PayloadAction<ProductType[]>) {
			state.products = action.payload
			state.loading = false
			state.error = null
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload
		},
		setError(state, action: PayloadAction<string>) {
			state.error = action.payload
			state.loading = false
		},
	},
})

export const { setProducts, setLoading, setError } = productsSlice.actions

export const selectProducts = (state: RootState) => state.products.products
export const selectLoading = (state: RootState) => state.products.loading
export const selectError = (state: RootState) => state.products.error

export default productsSlice.reducer
