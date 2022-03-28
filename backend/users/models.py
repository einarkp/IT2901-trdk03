from django.db import models
from django.contrib.auth.models import User
from django.db.models.base import Model
from django.db.models.deletion import CASCADE
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class ExtendUser(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    user_type = models.CharField(max_length=30, null=True, default="principal")
    schoolID = models.IntegerField(null=True, default=0)
    
    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_extended_user(sender, instance, created, **kwargs):
    if created:
        ExtendUser.objects.create(user=instance)

#@receiver(post_save, sender=User)
#def save_extended_usere(sender, instance, **kwargs):
 #   instance.ExtendUser.save()
