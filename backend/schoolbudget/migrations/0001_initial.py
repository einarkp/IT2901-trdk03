# Generated by Django 4.0.2 on 2022-03-13 21:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='School',
            fields=[
                ('responsibility', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Budget',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('amount', models.FloatField()),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='schoolbudget.school')),
            ],
            options={
                'unique_together': {('school', 'date')},
            },
        ),
        migrations.CreateModel(
            name='Prognosis',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('amount', models.FloatField()),
                ('budget', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='schoolbudget.budget')),
            ],
            options={
                'unique_together': {('budget', 'date')},
            },
        ),
        migrations.CreateModel(
            name='Prediction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('amount', models.FloatField()),
                ('lower_bound', models.FloatField()),
                ('upper_bound', models.FloatField()),
                ('coefficient', models.FloatField()),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='schoolbudget.school')),
            ],
            options={
                'unique_together': {('school', 'date', 'coefficient')},
            },
        ),
        migrations.CreateModel(
            name='BudgetChange',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('amount', models.FloatField()),
                ('budget', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='schoolbudget.budget')),
            ],
            options={
                'unique_together': {('budget', 'date')},
            },
        ),
        migrations.CreateModel(
            name='Accounting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('amount', models.FloatField()),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='schoolbudget.school')),
            ],
            options={
                'unique_together': {('school', 'date')},
            },
        ),
    ]
