import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import {
	selectError,
	selectLoading,
	selectProducts,
} from '../store/productsSlice'
import {
	Table,
	Button,
	Input,
	Space,
	Pagination,
	Popconfirm,
	Row,
	Col,
	Spin,
	Alert,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { deleteProduct, fetchProducts } from '../store/productsThunks'

const Products: React.FC = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const products = useSelector(selectProducts)
	const loading = useSelector(selectLoading)
	const error = useSelector(selectError)

	useEffect(() => {
		// @ts-ignore
		dispatch(fetchProducts())
	}, [dispatch])

	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 5

	const handleDelete = (id: string) => {
		// @ts-ignore
		dispatch(deleteProduct(id))
	}

	const filteredProducts = products.filter(product =>
		product.title.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const columns = [
		{
			title: 'Картинка',
			dataIndex: 'images',
			key: 'images',
			render: (images: File[]) => (
				<img
					src={`http://localhost:5001/${images[0]}`}
					alt='product'
					width={100}
					style={{ borderRadius: '6px' }}
				/>
			),
		},
		{
			title: 'Название',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
		},
		{
			title: 'Цена',
			dataIndex: 'price',
			key: 'price',
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_: any, record: any) => (
				<Space size='middle'>
					<Button
						type='link'
						onClick={() => navigate(`/products/edit/${record.id}`)}
					>
						Редактировать
					</Button>
					<Popconfirm
						title='Вы уверены, что хотите удалить этот товар?'
						onConfirm={() => handleDelete(record.id)}
						okText='Да'
						cancelText='Нет'
					>
						<Button type='link' danger>
							Удалить
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	]

	if (loading) return <Spin fullscreen size='large' />

	if (error)
		return (
			<Row justify='center'>
				<Alert
					style={{ width: '70%' }}
					message={`Ошибка: ${error}`}
					type='error'
				/>
			</Row>
		)

	return (
		<Row justify='center'>
			<Col style={{ width: '70%' }}>
				<Space direction='vertical' style={{ width: '100%' }}>
					<Space
						direction='horizontal'
						style={{ width: '100%', justifyContent: 'space-between' }}
					>
						<Input
							placeholder='Поиск по названию'
							prefix={<SearchOutlined />}
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>

						<Link to='/products/create'>
							<Button type='primary'>Добавить товар</Button>
						</Link>
					</Space>

					<Table
						columns={columns}
						dataSource={paginatedProducts.reverse()}
						pagination={false}
						locale={{ emptyText: 'Продуктов нет' }}
						rowKey='id'
					/>

					<Pagination
						current={currentPage}
						total={filteredProducts.length}
						pageSize={itemsPerPage}
						onChange={page => setCurrentPage(page)}
					/>
				</Space>
			</Col>
		</Row>
	)
}

export default Products
