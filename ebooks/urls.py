from django.urls import path
from .views import EbookListCreateView, EbookDeleteView

urlpatterns = [
    path("", EbookListCreateView.as_view(), name="ebook-list-create"),
    path("<int:pk>/delete/", EbookDeleteView.as_view(), name="ebook-delete"),
]
