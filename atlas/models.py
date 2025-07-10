from django.db import models

MODALITY_CHOICES = (
    ('CT', 'CT'),
    ('MRI', 'MRI'),
    ('X-ray', 'X-ray'),
)

class AtlasSeries(models.Model):
    name = models.CharField(max_length=200)
    modality = models.CharField(max_length=10, choices=MODALITY_CHOICES)
    description = models.TextField(blank=True)
    legend_image = models.ImageField(upload_to='atlas_legends/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.modality})"


class AtlasImage(models.Model):
    series = models.ForeignKey(AtlasSeries, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='atlas_series/')
    instance_number = models.PositiveIntegerField(default=0)  # Optional: helps with sorting

    def __str__(self):
        return f"{self.series.name} - Slice {self.instance_number}"
