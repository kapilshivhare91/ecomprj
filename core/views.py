from django.shortcuts import render,redirect
from django.http import HttpResponse
from core.models import Category, Vendor, Product, ProductImages, CartOrder, CartOrderItem, Product_review, Wishlist, Address, Tags
from django.core.mail import send_mail
from django.conf import settings
from .forms import ContactForm
from django.contrib import messages


# Create your views here.
def index(request):

    # server_products = product.objects.all().order_by("-id")
    server_products = Product.objects.filter(product_status="published", featured=True).order_by("-id")

    context = { "front_product":server_products }

    return render(request, 'core/index.html' , context)


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
        "vendors": vendors
    }
    return render(request, 'core/vendor-list.html', context)

def category_product_list_view(request, cid):
    category = Category.objects.get(cid = cid)
    products = Product.objects.filter(product_status="published", category = category)

    context = {
        "category": category,
        "products": products,
    }
    return render(request,'core/category-product-list.html', context)

from django.http import JsonResponse
from django.template.loader import render_to_string

def add_to_cart(request):
    # Get parameters from the AJAX GET request
    pid = request.GET.get("id")
    qty = request.GET.get("qty")
    title = request.GET.get("title")
    price = request.GET.get("price")
    image = request.GET.get("image")

    # Initialize cart session if it doesn't exist
    cart_data = request.session.get('cart_data_obj', {})

    # Check if item is already in cart
    if pid in cart_data:
        cart_data[str(pid)]['qty'] = int(cart_data[str(pid)]['qty']) + int(qty)
        cart_data[str(pid)]['price'] = price # Optional: update price if changed
    else:
        # Add new item
        cart_data[str(pid)] = {
            'title': title,
            'qty': int(qty),
            'price': price,
            'image': image,
            'pid': pid,
        }

    # Save session
    request.session['cart_data_obj'] = cart_data
    
    # Calculate total items
    return JsonResponse({
        "data": request.session['cart_data_obj'], 
        "totalcartitems": len(request.session['cart_data_obj'])
    })

def cart_view(request):
    cart_total_amount = 0
    if 'cart_data_obj' in request.session:
        for p_id, item in request.session['cart_data_obj'].items():
            cart_total_amount += float(item['price']) * int(item['qty'])
            
    return render(request, 'core/cart.html', {
        "cart_data": request.session.get('cart_data_obj', {}), 
        "total_amount": cart_total_amount, 
        "currency": "$" # Or fetch from settings
    })

def delete_item_from_cart(request):
    pid = request.GET.get('id')
    cart_data = request.session.get('cart_data_obj', {})
    
    if pid in cart_data:
        del cart_data[pid]
        request.session['cart_data_obj'] = cart_data
    
    cart_total_amount = 0
    if 'cart_data_obj' in request.session:
        for p_id, item in request.session['cart_data_obj'].items():
            cart_total_amount += float(item['price']) * int(item['qty'])
            
    context = render_to_string("core/async/cart-list.html", {
        "cart_data": request.session['cart_data_obj'], 
        "total_amount": cart_total_amount, 
        "currency": "$"
    })
    
    return JsonResponse({
        "data": context, 
        "totalcartitems": len(request.session['cart_data_obj'])
    })

def contact_view(request):
    context = {}
    return render(request, 'core/contact.html', context)

def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            email = form.cleaned_data['email']
            
            # Construct the full message body
            full_message = f"Message from: {name}\n\n{email}\n\n{message}"

            send_mail(
                subject,
                full_message,
                settings.EMAIL_HOST_USER,
                ['kapilshivhare2004@gmail.com'],
                fail_silently=False,
            )
            send_mail(
                f"Thank you for contacting us",
                f"Hello {name},\n\nWe have received your message and will get back to you shortly.\n\nBest regards,\nE-commerce Team\n\nThis is an system generated mail, please do not reply",
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            messages.success(request, "Your message has been sent successfully!") 
            return redirect("core:contact")
        else:
            messages.error(request, "There was an error in your form. Please correct it and try again.")
    else:
        form = ContactForm()

    return render(request, 'core/contact.html', {'form': form})