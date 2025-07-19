from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .models import Ebook
from .serializers import EbookSerializer

class EbookListCreateView(generics.ListCreateAPIView):
    queryset = Ebook.objects.all().order_by("-uploaded_at")
    serializer_class = EbookSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class EbookDeleteView(generics.DestroyAPIView):
    queryset = Ebook.objects.all()
    serializer_class = EbookSerializer
    permission_classes = [permissions.IsAdminUser]
