from rest_framework import serializers
from .models import User



class ChangeUserFormSerializer(serializers.Serializer):
    image = serializers.CharField(required=False,allow_null=True, allow_blank=True)
    first_name = serializers.CharField(required=False,allow_null=True, allow_blank=True)
    last_name = serializers.CharField(required=False,allow_null=True, allow_blank=True)
    username = serializers.CharField(required=False,allow_null=True, allow_blank=True)
    email = serializers.EmailField(required=False,allow_null=True, allow_blank=True)

    def update(self, instance, validated_data):
        instance.image = validated_data.get('image',instance.image)
        instance.first_name = validated_data.get('first_name',instance.first_name)
        instance.last_name = validated_data.get('last_name',instance.last_name)
        instance.username = validated_data.get('username',instance.username)
        instance.email = validated_data.get('email',instance.email)

        instance.save()
        return instance


class UserSerializer(serializers.Serializer):
    image = serializers.CharField(required=False,allow_null=True, allow_blank=True)
    first_name = serializers.CharField(required=False,allow_null=True, allow_blank=True)
    last_name = serializers.CharField(required=False,allow_null=True, allow_blank=True)
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data.get("username",None),
            email = validated_data.get("email",None)
        )
        user.set_password(validated_data.get('password',None))
        user.save()
        return user

        
       


