# urls
from django.urls import path
from core import views 
from core.views import index

app_name = 'core'

urlpatterns = [
    path("",index, name="index"),
    path("category-list/", views.category_list_view, name = "category-list"),
    path("vendor-list/", views.vendor_list_view, name = "vendor-list"),
    path("product-list/", views.product_list_view, name = "product-list"),
    path("category-product-list/", views.category_product_list_view, name = "category-product-list")
  ]