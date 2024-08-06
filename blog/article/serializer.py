from rest_framework import serializers

from .models import *

from users.models import *


class ArticleSerializer(serializers.ModelSerializer):
    creater = serializers.StringRelatedField()  # Показывает строковое представление пользователя
    tags = serializers.StringRelatedField(many=True)  # Использует __str__ для каждого тега

    class Meta:
        model = Article
        fields = ['title', 'text', 'creater', 'tags']

    def create(self, validated_data):
        title = validated_data.get('title')
        text = validated_data.get('text')
        # print(validated_data)
        creater = User.objects.get(
            username = validated_data.get('creater')
        )

        return Article.objects.create(
            title = title,
            text = text,
            creater = creater
        )
    

class UserArticleSerializer(serializers.ModelSerializer):
    
    creater = serializers.StringRelatedField()  # Показывает строковое представление пользователя
    tags = serializers.StringRelatedField(many=True)  # Использует __str__ для каждого тега

    class Meta:
        model = Article
        fields = ['title', 'text', 'creater', 'tags']

    def update(self, instance, validated_data):
        instance.title = validated_data.get(
            'title',
            instance.title
        )
        instance.text = validated_data.get(
            'text',
            instance.text
        )
        
        instance.save()

        return instance
    

class TagFilterSerialier(serializers.Serializer):
    tag = serializers.CharField()
    slug = serializers.SlugField()