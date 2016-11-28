from django.conf.urls import url
from api.app import views

urlpatterns = [
    url(r'^controller/$', views.MicroControllerView.as_view()),
    url(r'^controller/(?P<controller_id>.+)/plant/(?P<plant_id>.+)/water/(?P<amount>.+)/$',
        views.WaterPlantView.as_view()),
    url(r'^controller/(?P<controller_id>.+)/plant/(?P<plant_id>.+)/moisture/$',
        views.MoistureView.as_view()),
    url(r'^controller/(?P<controller_id>.+)/plant/(?P<plant_id>.+)/$', views.PlantView.as_view()),
    url(r'^controller/(?P<controller_id>.+)/plant/$', views.AllPlantsView.as_view())
]
