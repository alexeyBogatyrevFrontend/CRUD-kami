import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Products from './pages/Products.tsx'
import AddProduct from './pages/AddProduct.tsx'
import EditProduct from './pages/EditProduct.tsx'
import { Provider } from 'react-redux'
import store from './store/index.ts'
import 'react-quill/dist/quill.snow.css'
import './assets/global.css'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Navigate to='/products' />,
	},
	{
		path: '/products',
		element: <Products />,
	},
	{
		path: '/products/create',
		element: <AddProduct />,
	},
	{
		path: '/products/edit/:id',
		element: <EditProduct />,
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>
)
