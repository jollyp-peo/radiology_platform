# cases/urls.py
from django.urls import path
from .views import CaseListView, CaseUploadView, CaseDetailView
from . import views

urlpatterns = [
    path('', CaseListView.as_view()),
    path('upload/', CaseUploadView.as_view()),
    path('<int:pk>/', CaseDetailView.as_view()),
    path('<int:pk>/delete/', views.delete_case, name='delete_case'),
]
