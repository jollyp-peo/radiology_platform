from django.urls import path
from .views import CourseListView, CourseUploadView, CourseDeleteAPIView

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),
    path('upload/', CourseUploadView.as_view(), name='course-upload'),
    path("<int:pk>/delete/", CourseDeleteAPIView.as_view(), name="course-delete")
]
