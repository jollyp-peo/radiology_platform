from django.shortcuts import render

# Create your views here.
# cases/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes

from .models import Case, CaseImage
from .serializers import CaseSerializer

import pydicom
import numpy as np
from PIL import Image
import io
from django.core.files.base import ContentFile


class CaseListView(APIView):
    def get(self, request):
        cases = Case.objects.all().order_by("-created_at")
        serializer = CaseSerializer(cases, many=True, context={"request": request})
        return Response(serializer.data)


class CaseDetailView(RetrieveAPIView):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer


class CaseUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Only allow admin users
        if not hasattr(request.user, 'userprofile') or request.user.userprofile.role != 'admin':
            return Response({"detail": "Only admin can upload."}, status=403)

        title = request.data.get("title")
        category = request.data.get("category", "")
        description = request.data.get("description", "")
        files = request.FILES.getlist("files")

        if not title or not files:
            return Response({"detail": "Missing fields."}, status=400)

        case = Case.objects.create(title=title, category=category, description=description)

        saved_count = 0
        for file in files:
            filename = file.name.lower()
            try:
                if filename.endswith(".dcm") or '.' not in filename:
                    dicom = pydicom.dcmread(file, force=True)
                    pixel_array = dicom.pixel_array
                    instance_number = getattr(dicom, 'InstanceNumber', 0)

                    image = ((pixel_array - pixel_array.min()) / np.ptp(pixel_array) * 255).astype(np.uint8)
                    pil_image = Image.fromarray(image)
                    buffer = io.BytesIO()
                    pil_image.save(buffer, format="PNG")
                    buffer.seek(0)

                    new_file = ContentFile(buffer.read(), name=filename + ".png")
                    CaseImage.objects.create(case=case, image=new_file, instance_number=instance_number)
                    saved_count += 1

                elif filename.endswith(".jpg") or filename.endswith(".jpeg"):
                    pil_image = Image.open(file).convert("RGB")
                    buffer = io.BytesIO()
                    pil_image.save(buffer, format="PNG")
                    buffer.seek(0)

                    new_file = ContentFile(buffer.read(), name=filename.replace(".jpg", ".png"))
                    CaseImage.objects.create(case=case, image=new_file)
                    saved_count += 1

                elif filename.endswith(".png"):
                    CaseImage.objects.create(case=case, image=file)
                    saved_count += 1

            except Exception as e:
                print(f"⚠️ Skipping file {file.name}: {e}")

        return Response({
            "message": f"{saved_count} case image(s) uploaded.",
            "case_id": case.id
        }, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_case(request, pk):
    try:
        case = Case.objects.get(pk=pk)
    except Case.DoesNotExist:
        return Response({'error': 'Case not found.'}, status=status.HTTP_404_NOT_FOUND)

    case.delete()
    return Response({'message': 'Case deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
