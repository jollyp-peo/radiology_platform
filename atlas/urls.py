from django.urls import path
from .views import AtlasSeriesListView, AtlasUploadView, AtlasSeriesDetailView, AtlasDeleteView

urlpatterns = [
    path('', AtlasSeriesListView.as_view(), name='atlas-series'),
    path('<int:pk>/', AtlasSeriesDetailView.as_view(), name='atlas-detail'),
    path('upload/', AtlasUploadView.as_view(), name='atlas-upload'),
    path("<int:pk>/delete/", AtlasDeleteView.as_view(), name="atlas_delete"),

]

