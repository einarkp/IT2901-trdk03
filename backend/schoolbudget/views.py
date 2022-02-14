from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import AccountingSerializer, BudgetChangeSerializer, BudgetSerializer, PrognosisSerializer, SchoolSerializer
from .models import Accounting, BudgetChange, Prognosis, School, Budget

# Create your views here.

class SchoolView(viewsets.ViewSet):
    serializer_class = SchoolSerializer

    def list(self, request):
        queryset = School.objects.filter()
        serializer = SchoolSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = School.objects.filter()
        school = get_object_or_404(queryset, pk=pk)
        serializer = SchoolSerializer(school)
        return Response(serializer.data)

class AllBudgetsView(viewsets.ViewSet):
    serializer_class = BudgetSerializer

    def list(self, request):
        queryset = Budget.objects.filter()
        serializer = BudgetSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Budget.objects.filter()
        budget = get_object_or_404(queryset, pk=pk)
        serializer = BudgetSerializer(budget)
        return Response(serializer.data)

class BudgetView(viewsets.ViewSet):
    serializer_class = BudgetSerializer

    def list(self, request, school_pk=None):
        queryset = Budget.objects.filter(school=school_pk)
        serializer = BudgetSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, school_pk=None):
        queryset = Budget.objects.filter(pk=pk, school=school_pk)
        budget = get_object_or_404(queryset, pk=pk)
        serializer = BudgetSerializer(budget)
        return Response(serializer.data)

class AccountingView(viewsets.ViewSet):
    serializer_class = AccountingSerializer

    def list(self, request, school_pk=None):
        queryset = Accounting.objects.filter(school=school_pk)
        serializer = AccountingSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, school_pk=None):
        queryset = Accounting.objects.filter(pk=pk, school=school_pk)
        accounting = get_object_or_404(queryset, pk=pk)
        serializer = AccountingSerializer(Accounting)
        return Response(serializer.data)


class BudgetChangeView(viewsets.ViewSet):
    serializer_class = BudgetChangeSerializer

    def list(self, request, school_pk=None, budget_pk=None):
        queryset = BudgetChange.objects.filter(budget__school=school_pk, budget=budget_pk)
        serializer = BudgetChangeSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, school_pk=None, budget_pk=None):
        queryset = BudgetChange.objects.filter(pk=pk, budget=budget_pk, budget__school=school_pk)
        budget_change = get_object_or_404(queryset, pk=pk)
        serializer = BudgetChangeSerializer(budget_change)
        return Response(serializer.data)

class PrognosisView(viewsets.ViewSet):
    serializer_class = PrognosisSerializer

    def list(self, request, school_pk=None, budget_pk=None):
        queryset = Prognosis.objects.filter(budget__school=school_pk, budget=budget_pk)
        serializer = PrognosisSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, school_pk=None, budget_pk=None):
        queryset = Prognosis.objects.filter(pk=pk, budget=budget_pk, budget__school=school_pk)
        prognosis = get_object_or_404(queryset, pk=pk)
        serializer = PrognosisSerializer(prognosis)
        return Response(serializer.data)

