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
    ("shiped", "Shipped"),
    ("delivered", "Delivered"),
)



def user_directory_path(instance , filename):
    return 'user_{0}/{1}'.formate(instance.user.id, filename)

class category(models.Model):
    cid = ShortUUIDField(unique=True, Length=10, max_length=20, prefix='cat', alphabet='abcdefgh1234')
    title = models.CharField(max_length=100)
    image = models.Imagefield(upload_to="category")

    class Meta:
        verbose_name_plural = "categories"

    def category_image(self):
        return mark_safe('<img src="%s" width="50" height="50" />' % (self.image.url))

    def __str__(self):
        return self.title

class vendor(models.Model):

    vid = ShortUUIDField(unique=True, Length=10, max_length=20, prefix='ven', alphabet='abcdefgh1234')

    title = models.CharField(max_length=100 , default="Vendor Name")
    image = models.ImageField(upload_to=user_directory_path, default="vendor.jpg")
    description = models.TextField(max_length=100, blanck=False, null=False, default="Vendor Description")

    address = models.CharField(max_length=100, default="123 Main Street")
    phone   = models.CharField(max_Length=15, default="+123 (456) 789")
    chat_resp_time = models.CharField(max_Length=100, default="100%")
    shipping_on_time = models.CharField(max_length=100, default="100%")
    authentic_rating = models.CharField(max_length=100, default="100%")
    days_return = models.CharField(max_length=100, default="100%")
    warranty_period = models.CharField(max_Length=100, default="100%")

    user = models.ForeignKey(User, on_delete = models.SET_NULL, null=True)
    # if you want to delete the shop with user id use casscade

    class Meta:
        verbose_name_pular = "vendors"

    def vendor_image(self):
        return mark_safe('<img src="%s" width="50" height="50" />' % (self.image.url))
    
    def __str__(self):
        return self.title
    
class product(models.Model):
    pid = ShortUUIDField(unique=True, length=10, max_length=20,
                         prefix='pro', alphabet='abcdefgh1234')
    
    title = models.CharField(max_length=100 defult="Product Title")
    image = models.ImageField(upload_to=user_directory_path, default="product.jpg")
    description = models.TextField(max_Length=100, blank=FaLse, null=False, default="Product Description")

    user = models.Foreignkey(User, on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(category, on_delete=models.SET_NULL, null=True)

    price = models.DecimalField(max_length=99999999999999999999999, null=False, blank=False, decimal_places=2 default=1.99)
    old_price = models.DecimalField(max_length=99999999999999999999999, null=False, blank=False, decimal_places=2 default=2.99)

    specifications = models.TextField(nul=True, blank=True )
    tags = models.ForeignKey(Tags, on_delete=models.SET_NULL, null=True)

    product_status = models.CharField(choices=STATUS, 
    max_length=10, default ="in_review")

    status = models.BooleanField



    








 