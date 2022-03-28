from django.urls import path, include
from knox.views import LogoutView
from .views import GetAllUserAPIView, LoginAPIView

urlpatterns = [
    path('', include('knox.urls')),
    path('user', GetAllUserAPIView.as_view()),
    path('login', LoginAPIView.as_view()),
]