import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import { v4 as uuidv4 } from 'uuid'
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
	InputRef,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { ProductType } from '../../types'
import { createProductApi } from '../api'

const { Option } = Select

const AddProduct: React.FC = () => {
	const [product, setProduct] = useState<ProductType>({
		id: '',
		title: '',
		description: '',
		images: [],
		status: 'active',
		price: '',
	})
	const titleRef = useRef<InputRef>(null)

	const navigate = useNavigate()

	useEffect(() => {
		titleRef.current?.focus()
	}, [])

	const handleSave = async () => {
		const { title, images, price } = product

		if (!title || !images?.length || !price) {
			message.error('Пожалуйста, заполните все обязательные поля.')
			return
		}

		const newProduct = { ...product, id: uuidv4() }

		const formData = new FormData()

		formData.append('id', newProduct.id)
		formData.append('title', newProduct.title)
		formData.append('description', newProduct.description)
		formData.append('status', newProduct.status)
		formData.append('price', newProduct.price)

		newProduct.images.forEach(image => {
			formData.append(`images`, image)
		})

		try {
			await createProductApi(formData)

			message.success('Товар создан.')

			navigate('/products')
		} catch (error) {
			message.error('Ошибка при создании товара.')
		}
	}

	const handleUpload = ({ file }: any) => {
		setProduct(prev => ({ ...prev, images: [...prev.images, file] }))
	}

	return (
		<Row justify='center' align='middle' style={{ height: '100vh' }}>
			<Col xs={22} sm={20} md={16} lg={12} xl={8}>
				<Card title='Добавить товар'>
					<Form layout='vertical' onFinish={handleSave}>
						<Form.Item label='Название' required>
							<Input
								value={product.title}
								onChange={e =>
									setProduct(prev => ({ ...prev, title: e.target.value }))
								}
								ref={titleRef}
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

						<Form.Item label='Картинки' required>
							<Upload
								listType='picture'
								beforeUpload={() => false}
								onChange={handleUpload}
								multiple
							>
								<Button icon={<UploadOutlined />}>Загрузить</Button>
							</Upload>
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
								Добавить
							</Button>
							<Link to='/products'>
								<Button type='default' style={{ marginLeft: '10px' }}>
									Отмена
								</Button>
							</Link>
						</Form.Item>
					</Form>
				</Card>
			</Col>
		</Row>
	)
}

export default AddProduct
