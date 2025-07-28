from django.shortcuts import render,redirect
from django.http import HttpResponse
from core.models import category, vendor, product, productImages, cartOrder, CartOrderItem, product_review, wishlist, Address, Tags

# Create your views here.
def index(request):

    server_products = product.objects.all().order_by("-id")

    context = { "front_product":server_products }

    return render(request, 'core/index.html' , context)


