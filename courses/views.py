from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Course
from .serializers import CourseSerializer
import os
import subprocess
from django.conf import settings
from rest_framework.generics import DestroyAPIView

ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/avi', 'video/x-matroska', 'video/quicktime']
MAX_UPLOAD_SIZE = 1024 * 1024 * 1024  # 1 GB

class CourseListView(APIView):
    def get(self, request):
        courses = Course.objects.all().order_by('-created_at')
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data)

class CourseUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        course_type = request.data.get('type')

        if course_type == "Video":
            video_file = request.FILES.get('video')
            if not video_file:
                return Response({"detail": "Video file is required."}, status=400)

            # Check size
            if video_file.size > MAX_UPLOAD_SIZE:
                return Response({"detail": "Video file is too large (max 1 GB)."}, status=400)

            # Check MIME type
            if video_file.content_type not in ALLOWED_VIDEO_TYPES:
                return Response({"detail": f"Unsupported video format: {video_file.content_type}"}, status=400)

        if course_type == "Presentation":
            ppt_file = request.FILES.get('material')
            if ppt_file:
                if not ppt_file.name.endswith(('.ppt', '.pptx')):
                    return Response({"detail": "Only .ppt or .pptx files are allowed."}, status=400)

        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            course = serializer.save()

            # Convert video to .mp4 if needed
            if course_type == "Video":
                input_path = os.path.join(settings.MEDIA_ROOT, course.video.name)
                output_path = input_path.rsplit('.', 1)[0] + ".mp4"

                if not input_path.endswith(".mp4"):
                    # Convert using ffmpeg
                    subprocess.run([
                        "ffmpeg", "-i", input_path, "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23", output_path
                    ], check=True)

                    # Replace video field
                    relative_output = output_path.replace(str(settings.MEDIA_ROOT) + "/", "")
                    course.video.name = relative_output
                    course.save()

                    # Optionally delete original
                    os.remove(input_path)

            return Response(CourseSerializer(course).data, status=201)
        return Response(serializer.errors, status=400)

class CourseDeleteAPIView(DestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer