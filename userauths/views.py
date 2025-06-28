from django.shortcuts import render,redirect
from userauths.forms import UserRegisterForm
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.conf import settings
from django.contrib.auth  import get_user_model

# user = settings.AUTH_USER_MODEL
user = get_user_model()
# Create your views here.                                             
def register_view(request):

    if request.method == "POST":
        form = UserRegisterForm(request.POST or None)
        if form.is_valid():
            new_user = form.save()
            username = form.cleaned_data['username']
            messages.success(request,f"Hey {username}, your account has created successfully")
            new_user = authenticate( 
                username=form.cleaned_data['email'],
                password=form.cleaned_data['password1']
            )

            login(request, new_user)
            return redirect("core:index")

    else:
        form = UserRegisterForm()



    context = {
        'form' : form,
    }
    return render(request, "userauths/sign-up.html", context )


def login_view(request):
   if request.user.is_authenticated:
      return redirect("core:index")
   
   if request.method == "POST":
      email = request.POST.get("email")
      password = request.POST.get("password")

      try:
         user = user.objects.get(email = email)

      except:
         messages.warning(request, f"User with this email {email} does not exist  ")
      user = authenticate(request, email=email, password=password)

      if user is not None:
        login(request, user)
        messages.success(request, f"your are logged in {user.username}")
        return redirect("core:index")
      else:
        messages.warning(request,"user Does not Exist, Create an account.")
        return render(request, "userauths/sign-in.html")
   context ={
       
    }
   return render(request,"userauths/sign-up.html",context)


def logout_view(request):
    logout(request)
    messages.success(request, f"You are successfully logged out")
    return redirect("userauths:sign-in")
   