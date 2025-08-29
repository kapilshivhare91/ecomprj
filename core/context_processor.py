from core.models import Category, Vendor, Product, ProductImages, CartOrder, CartOrderItem, Product_review, Wishlist, Address, Tags

def default(request):
    categories = Category.objects.all()
    return {
        'categories' :categories,
    }