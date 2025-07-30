from django.shortcuts import render,redirect
from django.http import HttpResponse
from core.models import category, vendor, product, productImages, cartOrder, CartOrderItem, product_review, wishlist, Address, Tags

# Create your views here.
def index(request):

    # server_products = product.objects.all().order_by("-id")
    server_products = product.objects.filter(product_status="published", featured=True).order_by("-id")

    context = { "front_product":server_products }

    return render(request, 'core/index.html' , context)

def category_list_view(request):
    categories = category.objects.all()

    context = {
        "categories": categories
    }

    return render(request, 'core/category-list.html', context)


def vendor_list_view(request):
    vendors = vendor.objects.all()

    context = {
        "vendors": vendor
    }

    return render(request, 'core/vendor-list.html', context)
