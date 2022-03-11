import datetime
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from drf_multiple_model.viewsets import ObjectMultipleModelAPIViewSet
from .serializers import AccountingSerializer, BudgetChangeSerializer, BudgetSerializer, PredictionSerializer, PrognosisSerializer, SchoolSerializer
from .models import Accounting, BudgetChange, Prediction, Prognosis, School, Budget
from .arima import arima
from datetime import date
from dateutil.relativedelta import relativedelta

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
        for school in request.data:
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
        for budget in request.data:
            correspondingSchool = School.objects.filter(
                pk=budget["schoolId"]).first()
            # Delete old entry if it exists, only one budget entry should exist per year
            Budget.objects.filter(date__year = budget["year"], school=correspondingSchool).delete()
            
            # Add new value
            date = datetime.date(budget["year"], budget["month"], 1)
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

    def post(self, request, school_pk=None):  # Add/update accounting entry in db
        for accounting in request.data:
            # Cannot add future accounting values
            today = date.today()
            if (today.year < accounting["year"] or (today.year == accounting["year"] and today.month < accounting["month"])):
                return HttpResponse('Cannot add future accounting values', status=400)
            correspondingSchool = School.objects.filter(
                pk=accounting["schoolId"]).first()
            # Delete old entry if it exists, month&year combo is unique, should only ever exist one entry
            Accounting.objects.filter(date__month = accounting["month"], date__year = accounting["year"], school=correspondingSchool).delete()
            
            # Add new value
            date2add = datetime.date(accounting["year"], accounting["month"], 1)
            Accounting.objects.create(
                school=correspondingSchool, date=date2add, amount=accounting["amount"])
        return Response("Probably added some accounting values")

class PredicitonView(viewsets.ViewSet):
    serializer_class = PredictionSerializer

    # filters accountings by year if given
    def get_queryset(self, school_pk):
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')
        coefficient = self.request.query_params.get('coefficient')
        if start and end and coefficient:
            print(start, end)
            queryset = Prediction.objects.filter(
                date__range=(start, end), coefficient=coefficient, school=school_pk)
        else:
            queryset = Prediction.objects.filter(school=school_pk)
        return queryset

    def list(self, request, school_pk=None):
        serializer = PredictionSerializer(self.get_queryset(school_pk), many=True)
        return Response(serializer.data)

        
    def post(self, request, school_pk=None):
        ## Takes in a school-id, runs ARIMA on all accounting entries for that scool, saves the
        ## 12 calculated values as predictions (this involved replacing existing predictions with date 
        ## greater than latest accounting date).

        ## Maybe a better idea would be to handle predictions on a
        ## year to year basis? Easier to continually update?
        ## NOTE: There are 100% issues with this implementation, just can't think of them now...
        ## something to do with a lack of accounting data from users even though it's a new year
        ## and they want to see 12 values. This implementation would not take that into account (maybe?).
        ## A fix would be to do a date check for if it's december/january then just set the
        ## dates for the predictions for the upcoming year (month 1,2,3,4,5,6,7,8,9,10,11,12)...

        allAccountingValues = []
        accountings = Accounting.objects.filter(school = school_pk)
        for accounting in accountings:
            allAccountingValues.append(accounting.amount)

        arimaResults = arima(allAccountingValues, 12,0,1) 

        ## Delete all existing prediction values with date from latest accounting date until now.
        latestAccountingDate = Accounting.objects.filter(school = school_pk).latest("date").date
        Prediction.objects.filter(date__gte=latestAccountingDate, school = school_pk).delete()


        ## Add the new values from arima to prediction table, add year and month they belong to (date-object)
        ## day is irrelevant, start with latestAccountingDate+1month, then increment month
        safeStartDate = date(latestAccountingDate.year, latestAccountingDate.month, 12)
        currentPredictionDate = safeStartDate + relativedelta(months=1)  # TODO: NEEDS TESTING...
        correspondingSchool = School.objects.filter(
                pk=school_pk).first()
        for result in arimaResults:
            Prediction.objects.create(school=correspondingSchool, date=currentPredictionDate, amount=result, lower_bound=1, upper_bound=1, coefficient=1)
            currentPredictionDate += relativedelta(months=1)

        return Response("Probably created/updated some prediction values")

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
                {'queryset': Prediction.objects.filter(
                    date__year=year, school=school_pk), 'serializer_class': PredictionSerializer},
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
                {'queryset': Prediction.objects.filter(
                    school=school_pk), 'serializer_class': PredictionSerializer},
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
                {'queryset': Prediction.objects.filter(
                ), 'serializer_class': PredictionSerializer},
            )
        return querylist
