from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView
from rest_framework import status

from .models import AtlasSeries, AtlasImage
from .serializers import AtlasSeriesSerializer
import pydicom
import numpy as np
from PIL import Image
import io
from django.core.files.base import ContentFile


class AtlasSeriesListView(APIView):
    def get(self, request):
        series = AtlasSeries.objects.all().order_by('-created_at')
        serializer = AtlasSeriesSerializer(series, many=True, context={"request": request})
        return Response(serializer.data)


class AtlasSeriesDetailView(RetrieveAPIView):
    queryset = AtlasSeries.objects.all()
    serializer_class = AtlasSeriesSerializer


class AtlasUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Restrict to admin users only
        if not hasattr(request.user, 'userprofile') or request.user.userprofile.role != 'admin':
            return Response({"detail": "Only admin can upload."}, status=403)

        name = request.data.get('name')
        modality = request.data.get('modality')
        description = request.data.get('description', '')
        legend = request.FILES.get('legend_image')
        files = request.FILES.getlist('files')

        if not name or not modality or not files:
            return Response({"detail": "Missing required fields."}, status=400)

        series = AtlasSeries.objects.create(
            name=name,
            modality=modality,
            description=description,
            legend_image=legend
        )

        saved_count = 0
        for file in files:
            filename = file.name.lower()
            try:
                if filename.endswith(".dcm") or '.' not in filename:
                    # Handle DICOM file
                    dicom = pydicom.dcmread(file, force=True)
                    pixel_array = dicom.pixel_array
                    instance_number = getattr(dicom, 'InstanceNumber', 0)

                    image = ((pixel_array - pixel_array.min()) / np.ptp(pixel_array) * 255).astype(np.uint8)
                    pil_image = Image.fromarray(image)
                    buffer = io.BytesIO()
                    pil_image.save(buffer, format="PNG")
                    buffer.seek(0)

                    new_file = ContentFile(buffer.read(), name=filename + '.png')
                    AtlasImage.objects.create(series=series, image=new_file, instance_number=instance_number)
                    saved_count += 1

                elif filename.endswith(".jpg") or filename.endswith(".jpeg"):
                    # Convert JPG to PNG
                    pil_image = Image.open(file).convert("RGB")
                    buffer = io.BytesIO()
                    pil_image.save(buffer, format="PNG")
                    buffer.seek(0)

                    new_file = ContentFile(buffer.read(), name=filename.replace(".jpg", ".png"))
                    AtlasImage.objects.create(series=series, image=new_file)
                    saved_count += 1

                elif filename.endswith(".png"):
                    # PNG image already fine
                    AtlasImage.objects.create(series=series, image=file)
                    saved_count += 1

            except Exception as e:
                print(f"⚠️ Skipping file {file.name}: {e}")

        return Response({
            "message": f"{saved_count} image(s) processed.",
            "series_id": series.id
        }, status=status.HTTP_201_CREATED)

# delete logic
class AtlasDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        if not hasattr(request.user, 'userprofile') or request.user.userprofile.role != 'admin':
            return Response({"detail": "Only admin can delete."}, status=403)

        try:
            series = AtlasSeries.objects.get(id=pk)
            series.delete()
            return Response({"message": "Series deleted."}, status=status.HTTP_204_NO_CONTENT)
        except AtlasSeries.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)