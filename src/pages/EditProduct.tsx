import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RootState } from '../store'

import {
	Button,
	Input,
	Form,
	Select,
	Upload,
	message,
	Row,
	Col,
	Card,
	Image,
	FloatButton,
} from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import ReactQuill from 'react-quill'
import { ProductType } from '../../types'
import { editProduct } from '../store/productsThunks'

const { Option } = Select

const EditProduct: React.FC = () => {
	const { id } = useParams<{ id: string }>()

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const productToEdit = useSelector((state: RootState) =>
		state.products.products.find(product => product.id === id)
	)

	const [product, setProduct] = useState<ProductType>({
		id: '',
		title: '',
		description: '',
		images: [],
		status: 'active',
		price: '',
	})
	const [removedImages, setRemovedImages] = useState<string[]>([])

	useEffect(() => {
		if (productToEdit) {
			setProduct(productToEdit)
		} else {
			message.error('Товар не найден')
			navigate('/products')
		}
	}, [productToEdit, navigate])

	const handleSave = () => {
		const { id, title, images, price, description, status } = product

		if (!title || !images.length || !price) {
			message.error('Пожалуйста, заполните все обязательные поля.')
			return
		}

		const formData = new FormData()

		formData.append('id', id)
		formData.append('title', title)
		formData.append('description', description)
		formData.append('status', status)
		formData.append('price', price)

		images.forEach(image => {
			if (typeof image !== 'string') {
				formData.append('images', image as File)
			}
		})

		formData.append('removedImages', JSON.stringify(removedImages))
		// @ts-ignore
		dispatch(editProduct(id, formData))
		navigate('/products')
	}

	const handleUpload = ({ file }: any) => {
		setProduct(prev => ({
			...prev,
			images: [...prev.images, file],
		}))
	}

	const handleRemoveImage = (index: number) => {
		setProduct(prev => {
			const newImages = prev.images.filter((_, i) => i !== index)
			const removedImage = prev.images[index]

			if (typeof removedImage === 'string') {
				setRemovedImages(prevRemoved => [...prevRemoved, removedImage])
			}
			return { ...prev, images: newImages }
		})
	}

	return (
		<Row justify='center' align='middle' style={{ height: '100vh' }}>
			<Col xs={22} sm={20} md={16} lg={12} xl={8}>
				<Card title='Редактировать товар'>
					<Form layout='vertical' onFinish={handleSave}>
						<Form.Item label='Название' required>
							<Input
								value={product.title}
								onChange={e =>
									setProduct(prev => ({ ...prev, title: e.target.value }))
								}
							/>
						</Form.Item>

						<Form.Item label='Описание'>
							<ReactQuill
								value={product.description}
								onChange={value =>
									setProduct(prev => ({ ...prev, description: value }))
								}
							/>
						</Form.Item>

						<Form.Item label='Картинки'>
							<Upload
								listType='picture'
								beforeUpload={() => false}
								onChange={handleUpload}
								onRemove={file => {
									const index = product.images.findIndex((image: any) => {
										return image.uid === file.uid || image.name === file.name
									})

									if (index !== -1) {
										handleRemoveImage(index)
									}
								}}
								multiple
							>
								<Button icon={<UploadOutlined />}>Загрузить</Button>
							</Upload>
							<div
								style={{
									display: 'flex',
									overflow: 'auto',
									gap: '15px',
									padding: '10px 0',
								}}
							>
								{product.images
									.filter(image => typeof image !== 'object')
									.map((image, index) => (
										<div key={index} style={{ position: 'relative' }}>
											<Image
												src={`http://localhost:5001/${image}`}
												alt='product'
												width={150}
												style={{ cursor: 'pointer', borderRadius: '6px' }}
											/>
											<FloatButton
												onClick={() => handleRemoveImage(index)}
												style={{
													position: 'absolute',
													top: 0,
													right: 0,
													padding: 0,
												}}
												icon={<DeleteOutlined />}
											/>
										</div>
									))}
							</div>
						</Form.Item>

						<Form.Item label='Статус'>
							<Select
								value={product.status}
								onChange={value =>
									setProduct(prev => ({ ...prev, status: value }))
								}
							>
								<Option value='active'>Активный</Option>
								<Option value='archived'>Архивный</Option>
							</Select>
						</Form.Item>

						<Form.Item label='Цена' required>
							<Input
								value={product.price}
								onChange={e =>
									setProduct(prev => ({ ...prev, price: e.target.value }))
								}
								type='number'
							/>
						</Form.Item>

						<Form.Item>
							<Button type='primary' htmlType='submit'>
								Сохранить
							</Button>
							<Button
								type='default'
								onClick={() => navigate('/products')}
								style={{ marginLeft: '10px' }}
							>
								Отмена
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</Col>
		</Row>
	)
}

export default EditProduct
