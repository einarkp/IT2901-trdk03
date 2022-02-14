from dataclasses import fields
from rest_framework import serializers
from .models import Accounting, Budget, BudgetChange, Prognosis, School

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('responsibility', 'name')

class BudgetSerializer(serializers.ModelSerializer):
    parent_lookup_kwargs = {
        'school_pk' : 'school__pk'
    }
    class Meta:
        model = Budget
        fields = ('school', 'date', 'amount')


class AccountingSerializer(serializers.ModelSerializer):
    parent_lookup_kwargs = {
        'school_pk' : 'school__pk',
    }
    class Meta:
        model = Accounting
        fields = ('school', 'date', 'amount')

class BudgetChangeSerializer(serializers.ModelSerializer):
    parent_lookup_kwargs = {
        'budget_pk' : 'budget__pk',
        'school_pk' : 'school__pk',
    }
    class Meta:
        model = BudgetChange
        fields = ('budget', 'date', 'amount')


class PrognosisSerializer(serializers.ModelSerializer):
    parent_lookup_kwargs = {
        'budget_pk' : 'budget__pk',
        'school_pk' : 'school__pk',
    }
    class Meta:
        model = Prognosis
        fields = ('budget', 'date', 'amount')