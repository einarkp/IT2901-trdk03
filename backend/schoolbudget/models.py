from django.db import models

# Create your models here.
class School(models.Model):
    responsibility = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)

class Budget(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.FloatField()

    class Meta:
        unique_together = ('school', 'date')

class Accounting(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.FloatField()

    class Meta:
        unique_together = ('school', 'date')

class Prediction(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.FloatField()
    
    class Meta:
        unique_together = ('school', 'date')
        
class BudgetChange(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.FloatField()
    
    class Meta:
        unique_together = ('budget', 'date')


class Prognosis(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.FloatField()
    
    class Meta:
        unique_together = ('budget', 'date')