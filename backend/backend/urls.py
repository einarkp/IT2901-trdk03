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

from django.contrib import admin
from django.urls import include, path
from rest_framework_nested import routers
from knox import views as knox_views
from schoolbudget import views

router = routers.DefaultRouter()

# /schools/
# /schools/{responsibility}
router.register(r'schools', views.SchoolView, basename='schools')

# /budgets/
# /budgets/{pk}
router.register(r'budgets', views.AllBudgetsView, basename='budgets')

# /all-data
# /all-data?year=YYYY
router.register(r'all-data', views.AllDataView, basename='all-data')

schools_router = routers.NestedSimpleRouter(router, r'schools', lookup='school')

# /schools/{responsibility}/budgets
# /schools/{responsibility}/budgets/{pk}
schools_router.register(r'budgets', views.BudgetView, basename='school-budgets')

# /schools/{responsibility}/accountings
# /schools/{responsibility}/accountings?year=YYYY
# /schools/{responsibility}/accountings/{accounting_pk}
schools_router.register(r'accountings', views.AccountingView, basename='school-accountings')

# /schools/{responsibility}/pupils
# /schools/{responsibility}/pupils?year=YYYY
schools_router.register(r'pupils', views.PupilsView, basename='school-pupils')

# /schools/{responsibility}/predictions
# /schools/{responsibility}/predicitons?start=YYYY-MM-DD&end=YYYY-MM-DD
schools_router.register(r'predictions', views.PredicitonView, basename='school-predictions')

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
    path(r'admin/', admin.site.urls),
    path(r'api/auth/', include('knox.urls')),
    path(r'login/', views.LoginView.as_view(), name='knox_login'),
    path(r'logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path(r'logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
    path('getAvailableYears/', views.getAvailableYears),
]
