from django.urls import path
from .views import CourseListView, CourseUploadView

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),
    path('upload/', CourseUploadView.as_view(), name='course-upload'),
]
