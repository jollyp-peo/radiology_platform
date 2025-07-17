# cases/urls.py
from django.urls import path
from .views import CaseListView, CaseUploadView, CaseDetailView

urlpatterns = [
    path('', CaseListView.as_view()),
    path('upload/', CaseUploadView.as_view()),
    path('<int:pk>/', CaseDetailView.as_view()),
]
