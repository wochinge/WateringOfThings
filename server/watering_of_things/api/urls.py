from django.conf.urls import url
from watering_of_things.api import views

urlpatterns = [
    url(r'^controller/(?P<controller_id>.+)/plant/(?P<plant_id>.+)/water/(?P<amount>.+)/$',
        views.WaterPlantView.as_view()),
    url(r'^controller/(?P<controller_id>.+)/plant/(?P<plant_id>.+)/moisture/$',
        views.MoistureView.as_view()),
    url(r'^controller/(?P<controller_id>.+)/plant/(?P<plant_id>.+)/$', views.PlantView.as_view()),
    url(r'^controller/(?P<controller_id>.+)/plant/$', views.AllPlantsView.as_view()),
    url(r'^controller/(?P<controller_id>.+)/$', views.ControllerView.as_view()),
]
