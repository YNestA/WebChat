# -*- coding:utf-8 -*-
import views
from django.conf.urls import patterns,url

urlpatterns=patterns('',
    url(r'^$',views.login_user),
    url(r'^register/$',views.register),
    url(r'^u/(?P<username>.+)/$',views.user_chat),
    url(r'^choose-chat/$',views.choose_chat),
)