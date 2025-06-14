from django.shortcuts import render
from userauths.forms import UserRegisterForm

# Create your views here.
def register_views(request):
    form = UserRegisterForm()

    context = {
        'form' : form,
    }
    return render(request, "userauths/sign_up.html", context )