from django.urls import path
from .views import EbookListView, EbookUploadView, EbookDeleteView

urlpatterns = [
    path("", EbookListView.as_view(), name="ebook-list"),
    path("upload/", EbookUploadView.as_view(), name="ebook-upload"),
    path("<int:pk>/delete/", EbookDeleteView.as_view(), name="ebook-delete"),
]
