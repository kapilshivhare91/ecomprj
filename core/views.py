from django.shortcuts import render,redirect
from django.http import HttpResponse
from core.models import Category, Vendor, Product, ProductImages, CartOrder, CartOrderItem, Product_review, Wishlist, Address, Tags



# Create your views here.
def index(request):

    # server_products = product.objects.all().order_by("-id")
    server_products = Product.objects.filter(product_status="published", featured=True).order_by("-id")

    context = { "front_product":server_products }

    return render(request, 'core/index.html' , context)



def product_list_view(request):
    server_products = Product.objects.filter(product_status="published").order_by("-id")

    context = { 

        "front_product":server_products
         
          }

    return render(request, 'core/product-list.html', context)



def category_list_view(request):
    categories = Category.objects.all()

    context = {
        "categories": categories
    }

    return render(request, 'core/category-list.html', context)



def vendor_list_view(request):
    vendors = Vendor.objects.all()

    context = {
        "vendors": Vendor
    }

    return render(request, 'core/vendor-list.html', context)

def category_product_list_view(request, cid):
    category = Category.objects.get(cid = cid)
    products = Product.objects.filter(product_status="published", category = category)

    context = {
        "category": category,
        "products": products,
    }
    return render(request, 'core/category-product-list.html', context)
 
def cart_view(request):
    return render(request, 'core/cart.html')