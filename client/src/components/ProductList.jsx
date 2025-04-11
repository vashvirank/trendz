import { useSelector } from "react-redux";

const ProductList = () => {
  const { products, loading } = useSelector((state) => state.product);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {products.map((product) => (
            <div key={product._id} className="bg-gray-800">
              {product.name} - {product.category} - ${product.price}
              {product.reviews.map((review) => (
                <div key={review._id}>
                  <p>
                    {review.comment} - {review.rating}⭐
                  </p>
                </div>
              ))}
              <p>{product.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductList;
