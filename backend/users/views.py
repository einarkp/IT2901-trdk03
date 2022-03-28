from rest_framework import viewsets
from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import ExtendUserSerializer, LoginSerializer
from knox.models import AuthToken
from .models import ExtendUser
# Create your views here.

class GetAllUserAPIView(generics.RetrieveAPIView):
    """
    Returns a user object if the user is logged in.
    """
    serializer_class = ExtendUserSerializer
    def get_object(self):
      users = ExtendUser.objects.all()
      serializer = self.get_serializer(users, many=True)
      return Response(serializer.data)

class LoginAPIView(generics.GenericAPIView):
    """
    Returns a user object and its login token if login is successfull.
    """
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(request)
        serializer.is_valid(raise_exception=True)
        logged_user = serializer.validated_data
        for user in ExtendUser.objects.all():
          if logged_user == user.user:
            logged_user = user
            break
        return Response({
            "user": ExtendUserSerializer(logged_user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(logged_user.user)[1],
            "success": True
        })

