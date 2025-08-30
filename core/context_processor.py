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