from django.db import models

# Create your models here.


class Ebook(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    pdf = models.FileField(upload_to="ebooks/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
