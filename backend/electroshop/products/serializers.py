
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from .models import Category,Product,ProductImages,ProductReview,Tag
from users.serializers import PublicUserSerializer
from vendors.serializer import VendorSerializer
from vendors.models import Vendor

  
class CategorySerializer(ModelSerializer):
    parent_title = serializers.CharField(source='parent.title', read_only=True, default=None)

    class Meta:
        model = Category
        fields = '__all__'

    def validate_parent(self, value):
        if value is not None and value.parent_id is not None:
            raise serializers.ValidationError(
                "A category can only be nested one level deep — pick a top-level category as the parent."
            )
        return value

        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']



class ProductReviewSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)
    product_title = serializers.CharField(source='product.title', read_only=True)

    class Meta:
        model = ProductReview
        fields = [
            'id', 'user', 'product', 'product_title', 'rating', 'comment',
            'vendor_reply', 'vendor_reply_at', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'user', 'product', 'product_title',
            'vendor_reply', 'vendor_reply_at', 'created_at', 'updated_at',
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user  

        return super().create(validated_data)


class ProductImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = ['id', 'image']

    

class ProductImagesDetailSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImages
        fields = ['id', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url
 
class ProductSerializer(serializers.ModelSerializer):
    reviews = ProductReviewSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True)
    vendor = VendorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ProductImagesSerializer(many=True, required=False)
    discount_percentage = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    number_of_reviews = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields ='__all__'

    def get_discount_percentage(self, obj):
        return obj.calculate_discount_percentage()  

    def get_average_rating(self, obj):
        return obj.average_rating()

    def get_number_of_reviews(self, obj):
        return obj.number_of_reviews()
    
class ProductWriteSerializer(serializers.ModelSerializer):
    """Used for create/update by the owning vendor (or admin). Unlike
    ProductSerializer/ProductDetailSerializer, category and tags are
    writable (by id) rather than read-only nested objects."""

    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False, allow_null=True
    )
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, required=False
    )
    # Only used when an admin creates a product on a vendor's behalf; a
    # vendor's own product list always ignores this and uses their own
    # vendor profile instead (see ProductListView.perform_create).
    vendor = serializers.PrimaryKeyRelatedField(
        queryset=Vendor.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'image', 'description', 'category', 'tags', 'vendor',
            'price', 'old_price', 'specifications', 'product_status',
            'stock_quantity', 'featured', 'digital',
        ]
        read_only_fields = ['id']

    def validate_category(self, value):
        if value is not None and value.parent_id is None:
            raise serializers.ValidationError(
                "Select a subcategory — a top-level category can't be assigned to a product directly."
            )
        return value


class ProductDetailSerializer(serializers.ModelSerializer):
    reviews = ProductReviewSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True)
    vendor = VendorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ProductImagesDetailSerializer(many=True, required=False)  # updated
    image = serializers.SerializerMethodField(read_only=True)  # added
    discount_percentage = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    number_of_reviews = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_discount_percentage(self, obj):
        return obj.calculate_discount_percentage()  

    def get_average_rating(self, obj):
        return obj.average_rating()

    def get_number_of_reviews(self, obj):
        return obj.number_of_reviews()

    def get_image(self, obj):
        request = self.context.get('request')
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None
