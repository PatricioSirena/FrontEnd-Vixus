import Form from 'react-bootstrap/Form'
import PropTypes from 'prop-types'
import { Accordion } from 'react-bootstrap'
import { useEffect, useState, useMemo } from 'react'

const ProductFilterC = ({ products, onFilteredProducts }) => {
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [selectedColors, setSelectedColors] = useState([])
    const [selectedSizes, setSelectedSizes] = useState([])

    const { availableColors, availableSizes } = useMemo(() => {
        const colorCounts = {}
        const sizeCounts = {}
        products.forEach(product => {
            if (!product.variants || product.variants.length === 0) return
            product.variants.forEach(variant => {
                if (variant.color) {
                    colorCounts[variant.color] = (colorCounts[variant.color] || 0) + 1
                }
                if (variant.sizes && Array.isArray(variant.sizes)) {
                    variant.sizes.forEach(sizeObj => {
                        if (sizeObj.size) {
                            sizeCounts[sizeObj.size] = (sizeCounts[sizeObj.size] || 0) + 1
                        }
                    })
                }
            })
        })
        return {
            availableColors: Object.entries(colorCounts).map(([color, count]) => ({ color, count })),
            availableSizes: Object.entries(sizeCounts).map(([size, count]) => ({ size, count }))
        }
    }, [products])

    useEffect(() => {
        let filtered = products
        if (selectedColors.length > 0) {
            filtered = filtered.filter(product =>
                product.variants.some(variant => selectedColors.includes(variant.color))
            )
        }
        if (selectedSizes.length > 0) {
            filtered = filtered.filter(product =>
                product.variants.some(variant =>
                    variant.sizes.some(sizeObj => selectedSizes.includes(sizeObj.size))
                )
            )
        }
        const min = minPrice === '' ? 0 : Number(minPrice)
        const max = maxPrice === '' ? Infinity : Number(maxPrice)
        if (min > 0 || max !== Infinity) {
            filtered = filtered.filter(product => {
                const price = product.price
                return price >= min && price <= max
            })
        }
        onFilteredProducts(filtered)
    }, [products, selectedColors, selectedSizes, minPrice, maxPrice, onFilteredProducts])

    const handleColorChange = (color) => {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        )
    }

    const handleSizeChange = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        )
    }

    return (
        <div style={{ height: '100vh', color: 'grey', borderRight: '1px solid lightgrey', padding: '10px', position: 'sticky', top: 0, marginTop: '2em' }}>
            <h3>Filtros</h3>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Color</Accordion.Header>
                    <Accordion.Body>
                        {availableColors.map(({ color, count }) => (
                            <Form.Check
                                key={color}
                                type="checkbox"
                                label={`${color} (${count})`}
                                checked={selectedColors.includes(color)}
                                onChange={() => handleColorChange(color)}
                            />
                        ))}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Talle</Accordion.Header>
                    <Accordion.Body>
                        {availableSizes.map(({ size, count }) => (
                            <Form.Check
                                key={size}
                                type="checkbox"
                                label={`${size} (${count})`}
                                checked={selectedSizes.includes(size)}
                                onChange={() => handleSizeChange(size)}
                            />
                        ))}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Form style={{ marginTop: '1em', flexDirection: 'column' }}>
                <Form.Group className="mb-3" controlId="formBasicMinPrice">
                    <Form.Label>Precio Mínimo</Form.Label>
                    <Form.Control
                        type='text'
                        value={minPrice}
                        onChange={(e) => setMinPrice((e.target.value))}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicMaxPrice">
                    <Form.Label>Precio Máximo</Form.Label>
                    <Form.Control
                        type='text'
                        value={maxPrice}
                        onChange={(e) => setMaxPrice((e.target.value))}
                    />
                </Form.Group>
            </Form>
        </div>
    )
}

ProductFilterC.propTypes = {
    products: PropTypes.array.isRequired,
    onFilteredProducts: PropTypes.func.isRequired
}

export default ProductFilterC