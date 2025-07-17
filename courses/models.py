from django.db import models

# Create your models here.

class Course(models.Model):
    TYPE_CHOICES = [
        ("Video", "Video"),
        ("Lecture", "Lecture"),
        ("Presentation", "Presentation"),
    ]

    title = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    video = models.FileField(upload_to="courses/videos/", blank=True, null=True)
    material = models.FileField(upload_to="courses/presentations/", blank=True, null=True)
    meet_link = models.URLField(blank=True, null=True)
    recorded_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
