from django.db import models
from shortuuid.django_fields import ShortUUIDField
from django.utils.html import mark_safe
from userauths.models import User

STATUS_CHOICE = (
    ("process", "Processing"),
    ("shiped", "Shipped"),
    ("delivered", "Delivered"),
)

STATUS = (
    ("draft", "Draft"),
    ("disabled", "Disabled"),
    ("rejected", "Rejected"),
    ("in_review", "In Review"),   
    ("published", "Published"),
)

RATING = (
    ( 1, "★☆☆☆☆"),
    ( 2, "★★☆☆☆"),
    ( 3, "★★★☆☆"),
    ( 4, "★★★★☆"),
    ( 5, "★★★★★"),
)

class Tags(models.Model):
    pass


def user_directory_path(instance , filename):
    return 'user_{0}/{1}'.format(instance.user.id, filename)

class category(models.Model):
    cid = ShortUUIDField(unique=True, length=10, max_length=20, prefix='cat', alphabet='abcdefgh1234')
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to="category")

    class Meta:
        verbose_name_plural = "categories"

    def category_image(self):
        return mark_safe('<img src="%s" width="50" height="50" />' % (self.image.url))

    def __str__(self):
        return self.title

class vendor(models.Model):

    vid = ShortUUIDField(unique=True, length=10, max_length=20, prefix='ven', alphabet='abcdefgh1234')

    title = models.CharField(max_length=100 , default="Vendor Name")
    image = models.ImageField(upload_to=user_directory_path, default="vendor.jpg")
    description = models.TextField(max_length=100, blank=False, null=False, default="Vendor Description")

    address = models.CharField(max_length=100, default="123 Main Street")
    phone   = models.CharField(max_length=15, default="+123 (456) 789")
    chat_resp_time = models.CharField(max_length=100, default="100%")
    shipping_on_time = models.CharField(max_length=100, default="100%")
    authentic_rating = models.CharField(max_length=100, default="100%")
    days_return = models.CharField(max_length=100, default="100%")
    warranty_period = models.CharField(max_length=100, default="100%")

    user = models.ForeignKey(User, on_delete = models.SET_NULL, null=True)
    # if you want to delete the shop with user id use casscade

    class Meta:
        verbose_name_plural = "vendors"

    def vendor_image(self):
        return mark_safe('<img src="%s" width="50" height="50" />' % (self.image.url))
    
    def __str__(self):
        return self.title
    
class product(models.Model):
    pid = ShortUUIDField(unique=True, length=10, max_length=20, prefix='pro', alphabet='abcdefgh1234')
    
    title = models.CharField(max_length=100 ,default="Product Title")
    image = models.ImageField(upload_to=user_directory_path, default="product.jpg")
    description = models.TextField(max_length=100, blank=False, null=False, default="Product Description")

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(category, on_delete=models.SET_NULL, null=True, related_name="category")
    vendor = models.ForeignKey(vendor, on_delete=models.SET_NULL, null=True)


    price = models.DecimalField(max_digits=100, null=False, blank=False, decimal_places=2, default=1.99)
    old_price = models.DecimalField(max_digits=100, null=False, blank=False, decimal_places=2, default=2.99)

    specifications = models.TextField(null=True, blank=True )
    # Tags = models.ForeignKey(Tags, on_delete=models.SET_NULL, null=True, blank=True)

    product_status = models.CharField(choices=STATUS, 
    max_length=10, default ="in_review")

    status = models.BooleanField(default=True)
    in_stock = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    digital  = models.BooleanField(default=False)

    sku = ShortUUIDField(unique=True, length=4, max_length=10, prefix="sku", alphabet="1234567890")

    date = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Products"
    
    def product_image(self):
        return mark_safe('<img src="%s" width="100" height="100" />' % (self.image.url))
    
    def __str__(self):
        return self.title
    
    def get_percentage(self):
        new_price = (self.price / self.old_price) * 100
        return new_price
    
class productImages(models.Model):
    images = models.ImageField(upload_to="product-images", default="product.jpg")
    product = models.ForeignKey(product, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "product Images"


############################################### Cart, Order, OrederItem, and Address  ########################################################
############################################### Cart, Order, OrederItem, and Address  ########################################################


class cartOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=100, decimal_places=2, default="1.99")
    paid_status = models.BooleanField(default=False)
    order_date = models.DateTimeField(auto_now_add=True)
    product_status = models.CharField(choices=STATUS_CHOICE,max_length=30, default="processing")

    class Meta:
        verbose_name_plural = "Cart Orders"

class CartOrderItem(models.Model):
    order = models.ForeignKey(cartOrder, on_delete=models.CASCADE)
    invoice_No = models.CharField(max_length=100, default="INV_no-12345") 
    product_status = models.CharField(max_length=200)
    item = models.CharField(max_length=200)
    image = models.CharField(max_length=200)
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=100,
    decimal_places=2,default="1.99")
    total = models.DecimalField(max_digits=100,decimal_places=2, default="1.99")


 ############################################### product_revew, wishlist and Address  ########################################################

class product_review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(product, on_delete = models.SET_NULL, null=True )
    review = models.TextField()
    rating = models.IntegerField(choices=RATING, default=None)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Product Reviews"

    def __str__(self):
        return self.product.title
    
    def get_rating(self):
        return self.rating


class wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(product, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Wishlist"
    
    def __str__(self):
        return self.product.title
    
class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    Address = models.CharField(max_length=200, null=True, default="123 Main Street")
    city = models.CharField(max_length=100, null=True, default="New York")
    zip_code = models.CharField(max_length=20, null=True, default="10001")
    state = models.CharField(max_length=100, null=True, default="los angeles")
    country = models.CharField(max_length=100, null=True, default="USA")

    class Meta:
        verbose_name_plural = "Address"