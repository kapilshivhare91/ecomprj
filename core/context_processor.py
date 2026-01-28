from core.models import Category, Vendor, Product, ProductImages, CartOrder, CartOrderItem, Product_review, Wishlist, Address, Tags

def default(request):
    categories = Category.objects.all()
    return {
        'categories' :categories,
    }
def products(request):
    server_products = Product.objects.all()
    return {
        'front_product':server_products,
    }

def cart_count(request):
    cart_data = request.session.get('cart_data_obj', {})
    return {'cart_count': len(cart_data)}