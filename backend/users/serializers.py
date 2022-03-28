from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import ExtendUser

class ExtendUserSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    class Meta:
        model = ExtendUser
        fields = ('id', 'username', 'user_type', 'schoolID')
    
    def get_username(self, obj):
        return obj.user.username
        
    def get_id(self, obj):
        return obj.user.id



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    @staticmethod
    def validate(data):
        """
        Checks if username and password combo is valid.
        """
        user = authenticate(**data)
        return user