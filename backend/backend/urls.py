"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import include, path
from rest_framework_nested import routers
from schoolbudget import views

router = routers.DefaultRouter()

# /schools/
# /schools/{responsibility}
router.register(r'schools', views.SchoolView, basename='schools')

# /budgets/
# /budgets/{pk}
router.register(r'budgets', views.AllBudgetsView, basename='budgets')



schools_router = routers.NestedSimpleRouter(router, r'schools', lookup='school')

# /schools/{responsibility}/budgets
# /schools/{responsibility}/budgets/{pk}
schools_router.register(r'budgets', views.BudgetView, basename='school-budgets')

# /schools/{responsibility}/accountings
# /schools/{responsibility}/accountings/{accounting_pk}
schools_router.register(r'accountings', views.AccountingView, basename='school-accountings')


budgets_router = routers.NestedSimpleRouter(schools_router, r'budgets', lookup='budget')

# /schools/{responsibility}/budgets/{budget_pk}/changes
# /schools/{responsibility}/budgets/{budget_pk}/changes/{pk}
budgets_router.register(r'changes', views.BudgetChangeView, basename='budget-changes')

# /schools/{responsibility}/budgets/{budget_pk}/prognoses
# # /schools/{responsibility}/budgets/{budget_pk}/prognoses/{pk}
budgets_router.register(r'prognoses', views.PrognosisView, basename='budget-prognoses')


urlpatterns = [
    path(r'', include(router.urls)),
    path(r'', include(schools_router.urls)),
    path(r'', include(budgets_router.urls)),
]
