from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, permissions
from rest_framework.generics import DestroyAPIView
from .models import Ebook
from .serializers import EbookSerializer

MAX_UPLOAD_SIZE = 100 * 1024 * 1024  # 100 MB

class EbookListView(APIView):
    def get(self, request):
        ebooks = Ebook.objects.all().order_by('-uploaded_at')
        serializer = EbookSerializer(ebooks, many=True, context={'request': request})
        return Response(serializer.data)


class EbookUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        pdf_file = request.FILES.get("pdf")  # ✅ match model field name

        if not pdf_file:
            return Response({"detail": "PDF file is required."}, status=400)

        if not pdf_file.name.endswith(".pdf"):
            return Response({"detail": "Only PDF files are allowed."}, status=400)

        if pdf_file.size > MAX_UPLOAD_SIZE:
            return Response({"detail": "PDF file too large (max 100 MB)."}, status=400)

        serializer = EbookSerializer(data=request.data)
        if serializer.is_valid():
            ebook = serializer.save()
            return Response(EbookSerializer(ebook).data, status=201)

        return Response(serializer.errors, status=400)


class EbookDeleteView(DestroyAPIView):
    queryset = Ebook.objects.all()
    serializer_class = EbookSerializer
    permission_classes = [permissions.IsAdminUser]
