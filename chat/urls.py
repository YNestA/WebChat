# -*- coding:utf-8 -*-
import views
from django.conf.urls import patterns,url

urlpatterns=patterns('',
    url(r'^$',views.login),
)