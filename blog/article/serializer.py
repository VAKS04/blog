from rest_framework import serializers

from .models import *

from users.models import *


class ArticleUpdateSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field='slug',
        queryset=TagArticle.objects.all()
    )

    class Meta:
        model = Article
        fields = ['id','title', 'text', 'creater', 'tags']

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.text = validated_data.get('text', instance.text)
        instance.save()

        if 'tags' in validated_data:
            tags = validated_data['tags']
            print(tags)
            instance.tags.set(tags)

        return instance
    

class ArticleDeserializer(serializers.ModelSerializer):
    creater = serializers.CharField()
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field='slug',
        queryset=TagArticle.objects.all()
    )

    class Meta:
        model = Article
        fields = ['id','title', 'text', 'creater', 'tags']

    def create(self, validated_data):
        title = validated_data.get('title')
        text = validated_data.get('text')
        creater = User.objects.get(
            username = validated_data.get('creater')
        )
        get_tags = validated_data.get('tags')

        article = Article.objects.create(
            title = title,
            text = text,
            creater = creater,
        )
        article.save()
        article.tags.set(get_tags)

        return article


class ArticleSerializer(serializers.ModelSerializer):
    creater = serializers.CharField()
    tags = serializers.StringRelatedField(many=True)  # Использует __str__ для каждого тега

    class Meta:
        model = Article
        fields = ['id','title', 'text', 'creater', 'tags']
    

class TagFilterSerialier(serializers.Serializer):
    tag = serializers.CharField()
    slug = serializers.SlugField()