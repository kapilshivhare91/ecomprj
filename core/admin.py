from django.contrib import admin
from core.models import Category, Vendor, Product, ProductImages, CartOrder, CartOrderItem, Product_review, Wishlist,Address, Tags

class ProductImagesAdmin(admin.TabularInline):
    model = ProductImages

class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImagesAdmin]
    list_display = ['user','title', 'product_image','category', 'vendor' , 'price', 'featured', 'product_status']

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'category_image']

class VenderAdmin(admin.ModelAdmin):
    list_display = ['title','vendor_image']

class CartOrderAdmin(admin.ModelAdmin):
    list_display = ['user','price','paid_status','order_date','product_status']

class CartOrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'invoice_No','product_status', 'item', 'image', 'quantity', 'price', 'total']

class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['user','product','review','rating','date']

class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product']

class AddressAdmin(admin.ModelAdmin):
    list_display = ['user','Address','city', 'zip_code', 'state', 'country']


admin.site.register(Product , ProductAdmin)
admin.site.register(Category , CategoryAdmin)
admin.site.register(Vendor, VenderAdmin)
admin.site.register(CartOrder , CartOrderAdmin)
admin.site.register(CartOrderItem , CartOrderItemAdmin)
admin.site.register(Product_review,ProductReviewAdmin)
admin.site.register(Wishlist,WishlistAdmin)
admin.site.register(Address,AddressAdmin)