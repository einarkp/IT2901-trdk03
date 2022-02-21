import datetime
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from drf_multiple_model.viewsets import ObjectMultipleModelAPIViewSet
from .serializers import AccountingSerializer, BudgetChangeSerializer, BudgetSerializer, PredictionSerializer, PrognosisSerializer, SchoolSerializer
from .models import Accounting, BudgetChange, Prediction, Prognosis, School, Budget

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

    def post(self, request):
        # Needs validation etc etc.
        for school in request.data['schools']:
            School.objects.create(
                responsibility=school["responsibility"], name=school["name"])
        return Response("Probably added some schools")


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

    def post(self, request, school_pk=None):
        # Needs validation etc etc.
        for budget in request.data['budget']:
            date = datetime.datetime.fromtimestamp(budget["dateMs"])
            correspondingSchool = School.objects.filter(pk=budget["schoolId"]).first()
            Budget.objects.create(
                school=correspondingSchool, date=date, amount=budget["amount"])
        return Response("Probably added some budgets")


class AccountingView(viewsets.ViewSet):
    serializer_class = AccountingSerializer

    # filters accountings by year if given
    def get_queryset(self, school_pk):
        year = self.request.query_params.get('year')

        if year and year.isnumeric():
            queryset = Accounting.objects.filter(
                date__year=year, school=school_pk)
        else:
            queryset = Accounting.objects.filter(school=school_pk)
        return queryset

    def list(self, request, school_pk=None):
        serializer = AccountingSerializer(
            self.get_queryset(school_pk), many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, school_pk=None):
        queryset = Accounting.objects.filter(pk=pk, school=school_pk)
        accounting = get_object_or_404(queryset, pk=pk)
        serializer = AccountingSerializer(accounting)
        return Response(serializer.data)

    def post(self, request, school_pk=None):
        # Needs validation etc etc.
        for accounting in request.data['accounting']:
            # As we dont have a day, this is just set to 1.
            date = datetime.date(accounting["year"], accounting["month"], 1)
            correspondingSchool = School.objects.filter(
                pk=accounting["schoolId"]).first()
            Accounting.objects.create(
                school=correspondingSchool, date=date, amount=accounting["amount"])
        return Response("Probably added some accounting values")

class PredicitonView(viewsets.ViewSet):
    serializer_class = PredictionSerializer

    # filters accountings by year if given
    def get_queryset(self, school_pk):
        year = self.request.query_params.get('year')

        if year and year.isnumeric():
            queryset = Prediction.objects.filter(
                date__year=year, school=school_pk)
        else:
            queryset = Prediction.objects.filter(school=school_pk)
        return queryset

    def list(self, request, school_pk=None):
        serializer = PredictionSerializer(
            self.get_queryset(school_pk), many=True)
        return Response(serializer.data)

class BudgetChangeView(viewsets.ViewSet):
    serializer_class = BudgetChangeSerializer

    def list(self, request, school_pk=None, budget_pk=None):
        queryset = BudgetChange.objects.filter(
            budget__school=school_pk, budget=budget_pk)
        serializer = BudgetChangeSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, school_pk=None, budget_pk=None):
        queryset = BudgetChange.objects.filter(
            pk=pk, budget=budget_pk, budget__school=school_pk)
        budget_change = get_object_or_404(queryset, pk=pk)
        serializer = BudgetChangeSerializer(budget_change)
        return Response(serializer.data)


class PrognosisView(viewsets.ViewSet):
    serializer_class = PrognosisSerializer

    def list(self, request, school_pk=None, budget_pk=None):
        queryset = Prognosis.objects.filter(
            budget__school=school_pk, budget=budget_pk)
        serializer = PrognosisSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, school_pk=None, budget_pk=None):
        queryset = Prognosis.objects.filter(
            pk=pk, budget=budget_pk, budget__school=school_pk)
        prognosis = get_object_or_404(queryset, pk=pk)
        serializer = PrognosisSerializer(prognosis)
        return Response(serializer.data)


class AllDataView(ObjectMultipleModelAPIViewSet):
    def get_querylist(self):
        year = self.request.query_params.get('year')
        school_pk = self.request.query_params.get('school')

        # probably a better way to do this
        if year and year.isnumeric():
            querylist = (
                {'queryset': Accounting.objects.filter(
                    date__year=year, school=school_pk), 'serializer_class': AccountingSerializer},
                {'queryset': Budget.objects.filter(
                    date__year=year, school=school_pk), 'serializer_class': BudgetSerializer},
                {'queryset': BudgetChange.objects.filter(
                    date__year=year, budget__school=school_pk), 'serializer_class': BudgetChangeSerializer},
                {'queryset': Prognosis.objects.filter(
                    date__year=year, budget__school=school_pk), 'serializer_class': BudgetChangeSerializer},
            )
        elif school_pk and school_pk.isnumeric():
            querylist = (
                {'queryset': Accounting.objects.filter(
                    school=school_pk), 'serializer_class': AccountingSerializer},
                {'queryset': Budget.objects.filter(
                    school=school_pk), 'serializer_class': BudgetSerializer},
                {'queryset': BudgetChange.objects.filter(
                    budget__school=school_pk), 'serializer_class': BudgetChangeSerializer},
                {'queryset': Prognosis.objects.filter(
                    budget__school=school_pk), 'serializer_class': BudgetChangeSerializer},
            )
        else:
            querylist = (
                {'queryset': Accounting.objects.filter(
                ), 'serializer_class': AccountingSerializer},
                {'queryset': Budget.objects.filter(
                ), 'serializer_class': BudgetSerializer},
                {'queryset': BudgetChange.objects.filter(
                ), 'serializer_class': BudgetChangeSerializer},
                {'queryset': Prognosis.objects.filter(
                ), 'serializer_class': BudgetChangeSerializer},
            )
        return querylist
