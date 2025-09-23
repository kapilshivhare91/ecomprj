from django import forms

class ContactForm(forms.Form):
  name = forms.CharField(
    label="",
    widget=forms.TextInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Full Name',
            'id': 'name',
        }
    )
  )
  email = forms.EmailField(
    label="",
    widget=forms.EmailInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Email',
            'id': 'email',
        }
    )
 )
  subject = forms.CharField(
    label="",
    widget=forms.TextInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Subject',
            'id': 'subject',
        }
    )
 )
  message = forms.CharField(
    label="",
    widget=forms.Textarea(
        attrs={
            'class': 'form-control',
            'placeholder': 'Message',
            'id': 'message',
            'style': 'height: 120px'
        }
    )
)