from django.db import models

# Create your models here.
# cases/models.py

class Case(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CaseImage(models.Model):
    case = models.ForeignKey(Case, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="cases/images/")
    instance_number = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.case.title} - {self.instance_number}"

