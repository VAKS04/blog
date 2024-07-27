from rest_framework import serializers
from .models import *
from users.models import *

class ArticleSerializer(serializers.Serializer):
    title = serializers.CharField()
    text = serializers.CharField()
    creater = serializers.CharField()


    def create(self, validated_data):
        title = validated_data.get('title')
        text = validated_data.get('text')
        # print(validated_data)
        creater = User.objects.get(username = validated_data.get('creater'))

        return Article.objects.create(
            title = title,
            text = text,
            creater = creater
            )
    

class UserArticleSerializer(serializers.Serializer):
    title = serializers.CharField()
    text = serializers.CharField()

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title',instance.title)
        instance.text = validated_data.get('text',instance.text)

        instance.save()
        return instance
    


