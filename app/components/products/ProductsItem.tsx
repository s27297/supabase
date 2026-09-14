import type { Product } from '@/app/utils/types'
import '../../css/products/ProductsItem.css'

export default function ProductItem({ product }: { product: Product }) {
    return (
        <div className="product-item">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span className="price">{product.price.toFixed(2)} PLN</span>
    </div>
)
}