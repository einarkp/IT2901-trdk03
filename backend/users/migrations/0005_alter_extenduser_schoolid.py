# Generated by Django 4.0.2 on 2022-04-06 12:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_extenduser_user_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='extenduser',
            name='schoolID',
            field=models.IntegerField(default=0, null=True),
        ),
    ]