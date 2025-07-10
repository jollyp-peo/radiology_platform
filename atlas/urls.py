from django.urls import path
from .views import AtlasSeriesListView, AtlasUploadView, AtlasSeriesDetailView

urlpatterns = [
    path('', AtlasSeriesListView.as_view(), name='atlas-series'),
    path('<int:pk>/', AtlasSeriesDetailView.as_view(), name='atlas-detail'),
    path('upload/', AtlasUploadView.as_view(), name='atlas-upload'),
]

