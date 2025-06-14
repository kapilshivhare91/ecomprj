from django.shortcuts import render
from userauths.forms import UserRegisterForm

# Create your views here.
def register_view(request):

    if request.method == "POST":
        print("User registered successfully")

    else:
        print("User registration failed")

    form = UserRegisterForm()

    context = {
        'form' : form,
    }
    return render(request, "userauths/sign_up.html", context )