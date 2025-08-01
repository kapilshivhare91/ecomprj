from django.contrib import admin
from core.models import category, vendor, product, productImages,cartOrder, CartOrderItem, product_review, wishlist,Address, Tags

class ProductImagesAdmin(admin.TabularInline):
    model = productImages

class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImagesAdmin]
    list_display = ['user','title', 'product_image','category', '  price', 'featured', 'product_status']

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'category_image']

class VenderAdmin(admin.ModelAdmin):
    list_display = ['title','vendor_image']

class cartOrderAdmin(admin.ModelAdmin):
    list_display = ['user','price','paid_status','order_date','product_status']

class CartOrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'invoice_No','product_status', 'item', 'image', 'quantity', 'price', 'total']

class productReviewAdmin(admin.ModelAdmin):
    list_display = ['user','product','review','rating','date']

class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product']

class AddressAdmin(admin.ModelAdmin):
    list_display = ['user','Address','city', 'zip_code', 'state', 'country']


admin.site.register(product , ProductAdmin)
admin.site.register(category , CategoryAdmin)
admin.site.register(vendor, VenderAdmin)
admin.site.register(cartOrder , cartOrderAdmin)
admin.site.register(CartOrderItem , CartOrderItemAdmin)
admin.site.register(product_review,productReviewAdmin)
admin.site.register(wishlist,WishlistAdmin)
admin.site.register(Address,AddressAdmin)