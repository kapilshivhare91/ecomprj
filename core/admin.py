from django.contrib import admin
from core.models import category, vendor, product, productImages,cartOrder, CartOrderItem, product_review, wishlist,Address, Tags

class ProductImagesAdmin(admin.TabularInline):
    model = productImages

class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImagesAdmin]
    list_display = ['user','title', 'product_image','price', 'feature', 'product_status']

class CategoryAdmin(admin.ModelAdmin):
    inlines = []
    )