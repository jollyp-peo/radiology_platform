from django.contrib import admin
from .models import AtlasSeries, AtlasImage

class AtlasImageInline(admin.TabularInline):
    model = AtlasImage
    extra = 0

@admin.register(AtlasSeries)
class AtlasSeriesAdmin(admin.ModelAdmin):
    list_display = ('name', 'modality', 'created_at')
    inlines = [AtlasImageInline]
