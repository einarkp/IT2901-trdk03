from django.contrib import admin
from .models import Prediction, School, Budget, Accounting, BudgetChange, Prognosis

# Register your models here.
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('responsibility', 'name')

class BudgetAdmin(admin.ModelAdmin):
    list_display = ('school', 'date', 'amount')

class UpdateAdmin(admin.ModelAdmin):
    list_display = ('budget', 'date', 'amount')

class PredictionAdmin(admin.ModelAdmin):
    list_display = ('school', 'date', 'amount', 'lower_bound', 'upper_bound', 'coefficient')

admin.site.register(School, SchoolAdmin)
admin.site.register([Budget, Accounting], BudgetAdmin)
admin.site.register([BudgetChange, Prognosis], UpdateAdmin)
admin.site.register(Prediction, PredictionAdmin)
