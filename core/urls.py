# urls
from django.urls import path
from core import views 
from core.views import index

app_name = 'core'

urlpatterns = [
    # home_page
    path("",index, name="index"),
    path("product-list/", views.product_list_view, name = "product-list"),

    #category
    path("category-list/", views.category_list_view, name = "category-list"),
    path("category-list/<cid>/", views.category_product_list_view, name = "category-product-list"),

    #vendor
    path("vendor-list/", views.vendor_list_view, name = "vendor-list"),
    path("cart/", views.cart_view, name = "cart"),

    #contact
    path("contact/", views.contact_view, name = "contact"),
  ]

