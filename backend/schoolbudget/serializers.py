from dataclasses import fields
from rest_framework import serializers
from .models import Accounting, Budget, BudgetChange, Prediction, Prognosis, School, Pupils

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('responsibility', 'name','schoolSimiliar')

class BudgetSerializer(serializers.ModelSerializer):
    parent_lookup_kwargs = {
        'school_pk' : 'school__pk'
    }
    class Meta:
        model = Budget
        fields = ('school', 'date', 'amount')

class BudgetPredictionSerializer(serializers.ModelSerializer):
    parent_lookup_kwargs = {
        'school_pk' : 'school__pk'
    }
    class Meta:
        model = Budget
        fields = ('school', 'date', 'amount')

class PupilsSerializer(serializers.ModelSerializer):
    parent_lookup_kwargs = {
        'school_pk' : 'school__pk',
    }
    class Meta:
        model = Pupils
        fields = ('school', 'year', 'spring','autumn', 'grade')


class AccountingSerializer(serializers.ModelSerializer):
    parent_lookup_kwargs = {
        'school_pk' : 'school__pk',
    }
    class Meta:
        model = Accounting
        fields = ('school', 'date', 'amount')

class PredictionSerializer(serializers.ModelSerializer):
    parent_lookup_kwargs = {
        'school_pk' : 'school__pk',
    }
    class Meta:
        model = Prediction
        fields = ('school', 'date', 'amount', 'lower_bound', 'upper_bound', 'coefficient')

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